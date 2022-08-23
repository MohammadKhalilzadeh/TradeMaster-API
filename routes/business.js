const express = require('express')
const router = express.Router()
const Business = require('../models/business')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("req.body");
        cb(null, 'images/businesses')
    },
    filename:(req, file, cb) => {
        console.log("req.body");
        console.log(file);
        cb(null, 'business-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

router.get('/allverified', async (req,res) => {
    try{
        const bs = await Business.find()
        console.log(bs);
        return res.json(bs)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

// used in phone
router.get('/:id',getBusiness, async (req,res)=>{
    console.log(res.bs);
    res.json(res.bs)
})

// used in phone
router.get('/mines/:id', async (req,res) => {
    try{
        const bs = await Business.find().where('owner').equals(req.params.id)
        res.json(bs)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

// used in phone
router.post('/', checkAuth, async (req,res)=>{
    console.log(req.body);
    const business = new Business(req.body)
    try{
        await business.save()
        res.status(200).json(business)
    }catch(err){
        res.send(err.message)
    }
})

// used in phone
router.post('/image/:id', upload.single('image'),  async(req, res) => {
    try {

        const business = await Business.findById(req.params.id)
    
        if(!business){
            res.status(404).json({message:'Not Found'})
        }else{
            business.imgs.push(req.file.filename)
            await business.save()
            res.status(200).json(business)
        }

    } catch (error) {
        res.status(500).json({message:error.message})
    }
} )

// used in phone
router.patch('/:id', checkAuth,  async(req,res) => {
    try{
        const business1 = await Business.findByIdAndUpdate(req.params.id,req.body)
        const business2 = await business1.save()
        res.status(200).json(business2)
    }catch(err){
        res.status(500).json({ message: err.message})
    }
})

router.delete('/:id', checkAuth,  getBusiness, async (req, res) => {
    try {
        await res.bs.remove()
        res.status(200).json({ message: 'Deleted Business' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getBusiness(req, res, next) {
    let bs
    try {
        bs = await Business.findById(req.params.id)
        if (bs == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.bs = bs
    next()
}

module.exports = router