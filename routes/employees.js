const express = require('express')
const router = express.Router()
const Emp = require('../models/employee')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth,  async(req,res) => {
    try{
        const emp = await Emp.find()
        res.status(200).json(emp)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', checkAuth,  getEmp,  async  (req, res) => {
    return res.status(200).json(res.emp)
})


router.post('/', checkAuth,  async (req,res) => {

    try{
        Emp.findOne({username: req.body.username})
        .exec()
        .then(emp => {
            if (emp) {
                return res.status(409).json({
                    message: 'Conflict'
                })
            }else{

                bcrypt.hash( req.body.password, 10, async (err, hash)=>{
                    if(err){
                        console.log(err);
                        return res.status(503).json({
                            error : "Service Unavailable"
                        })
                    } else {
                        const emp = new Emp(req.body)
                        emp.password = hash
                        await emp.save().then(result => {
                            res.status(200).json(result)
                        }).catch(err => {
                            res.status(500).json({error: err})
                        })
                    }
                })
            }
        }).catch()
    }catch(err){
        res.status(500).json({ message: error.message})
    }

})

// Get by Email or Phone
router.post('/single/:input', async  (req, res) => {
    console.log(req.params.input);
    Emp.findOne({username:req.params.input})
    .exec()
    .then(emp => {
        if(!emp){
            return res.status(404).json({
                message:'Not Found'
            })
        }
        bcrypt.compare(req.body.password,emp.password,(err,result)=>{
            if(err){
                return res.status(406).json({
                    message:'Not Acceptable'
                })
            }
            if(result){
                const token = jwt.sign({
                    "id":emp._id,
                },
                "tm4ever",
                {
                   expiresIn:"1h"
                },
                )
                return res.status(200).json({token:token})
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    })

})

router.delete('/:id', checkAuth, getEmp, async(req,res)=>{
    try{
        await res.emp.remove()
        res.status(200).json({message:'Deleted'})
    }catch(err){
        res.status(500).json({ message: err.message })
    }
})

async function getEmp(req, res, next) {
    let emp
    try {
        console.log(req.params.id);
        emp = await Emp.findById(req.params.id)
        if (emp == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        console.log("ERROR : " + error);
        return res.status(500).json({ message: error.message })
    }

    res.emp = emp
    next()
}

module.exports = router