const express = require('express')
const router = express.Router()
const Allies = require('../models/allies')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("req.body");
        cb(null, 'images/allies')
    },
    filename:(req, file, cb) => {
        console.log("req.body");
        console.log(file);
        cb(null, 'ally_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})


router.get('/', async(req,res) => {
    try{
        const Ally = await Allies.find()
        res.status(200).json(Ally)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', upload.single('image'), checkAuth,  async (req,res) => {
    const ally = new Allies({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        sheba: req.body.sheba,
        logo: req.file.path
    })

    try{
        await ally.save()
        res.status(200).json(ally)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

router.delete('/:id', checkAuth,  getAlly, async(req,res)=>{
    try{
        fs.unlinkSync( path.join(__dirname,'../'+ res.ally.logo));
        await res.ally.remove()
        res.status(200).json({message:'Deleted'})
    }catch(err){
        console.log(err);
        res.status(400).json({ message: err.message })
    }
})

async function getAlly(req, res, next) {
    let ally
    try {
        console.log(req.params.id);
        ally = await Allies.findById(req.params.id)
        if (ally == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.ally = ally
    next()
}

module.exports = router