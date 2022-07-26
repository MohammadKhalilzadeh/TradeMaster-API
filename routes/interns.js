const express = require('express')
const router = express.Router()
const Interns = require('../models/interns')
const checkAuth = require('../middleware/check-auth')


router.get('/', checkAuth, async (req,res) => {
    try {
        const interns = await Interns.find()
        res.json(interns)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.get('/:id',getIntern , async(req,res)=>{
    res.send(res.intern)
})

router.post('/', checkAuth,  async (req,res)=>{
    const intern = new Interns({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        phone: req.body.phone,
        idnumber: req.body.idnumber,
        natinumber: req.body.natinumber,
        course: req.body.course,
        birthdate: req.body.birthdate,
    })

    try {
        await intern.save()
        res.status(200).json(intern)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

router.delete('/:id', checkAuth, getIntern, async(req,res)=>{
    try{
        await res.intern.remove()
        res.status(200).json({ message : 'Intern Deleted' })
    }catch(error){
        res.status(500).json({ message: error.message})
    }
})

async function getIntern(req, res, next) {
    let intern
    try {
        intern = await Interns.findById(req,params.id)
        if(intern == null){
            return res.status(404).json({ message : 'Not Found' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }

    res.intern = intern
    next()
}

module.exports = router