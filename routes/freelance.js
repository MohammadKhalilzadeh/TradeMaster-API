const express = require('express')
const router = express.Router()
const Freelancer = require('../models/freelancer')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("req.body");
        cb(null, 'images/freelancers')
    },
    filename:(req, file, cb) => {
        console.log("req.body");
        console.log(file);
        cb(null, 'fl_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})


router.get('/', async(req,res) => {
    try{
        const free = await Freelancer.find()
        res.status(200).json(free)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', upload.single('image'), checkAuth,  async (req,res) => {
    const free = new Freelancer({
        fullname: req.body.fullname,
        team: req.body.team,
        country: req.body.country,
        image: req.file.path
    })

    try{
        await free.save()
        res.status(200).json(free)
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

router.delete('/:id', checkAuth,  getAlly, async(req,res)=>{
    try{
        fs.unlinkSync( path.join(__dirname,'../'+ res.free.image));
        await res.free.remove()
        res.status(200).json({message:'Deleted'})
    }catch(err){
        console.log(err);
        res.status(400).json({ message: err.message })
    }
})

async function getAlly(req, res, next) {
    let free
    try {
        console.log(req.params.id);
        free = await Freelancer.findById(req.params.id)
        if (free == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.free = free
    next()
}

module.exports = router