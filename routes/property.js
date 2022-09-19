const express = require('express')
const router = express.Router()
const Property = require('../models/property')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/property')
    },
    filename:(req, file, cb) => {
        cb(null, 'usrpic_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

// Getting all
router.get('/', async (req, res) => {
    try{
        const property = await Property.find()
        return res.status(200).json(property)
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
})

router.get('/types/:type', async (req, res) => {
    try{
        const property = await Property.find().where("type").equals(req.params.type)
        return res.status(200).json(property)
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
})

router.get('/suggest/:type', async (req, res) => {
    console.log("000000");
    try{
        const property = await Property.find().where("type").equals(req.params.type).limit(3).exec()
        return res.status(200).json(property)
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', async(req,res) => {
    console.log(req.params.id);
    try {
        const property = await Property.findById(req.params.id)
        return res.status(200).json(property)
    } catch (error) {
        return res.status(500).json(error)
    }
})

router.post('/search',  async(req,res)=>{
    try {
        console.log(req.body.search)
        let search = req.body.search
        let find = await Property.find({ name: { $regex:new RegExp( '.*'+ search +'.*','i') } }).limit(100).exec()
        res.send(find)
        // const result = await User.find({phone: req.body.search}).exec()
        // console.log(result);
        // res.json(result)
    } catch (error) {
        res.json(error)
    }
})

router.post('/search/:type',  async(req,res)=>{
    try {
        console.log(req.body.search)
        let search = req.body.search
        let find = await Property.find({ name: { $regex:new RegExp( '.*'+ search +'.*','i') } }).where("type").equals(req.params.type).limit(100).exec()
        res.send(find)
        // const result = await User.find({phone: req.body.search}).exec()
        // console.log(result);
        // res.json(result)
    } catch (error) {
        res.json(error)
    }
})


router.post('/', async (req,res)=>{
    console.log(req.body);
    const property = new Property(req.body)
    try{
        await property.save()
        res.status(200).json(property)
    }catch(err){
        res.send(err.message)
    }
})

router.post('/image/:id', upload.single('image'),  async(req, res) => {
    try {

        const property = await Property.findById(req.params.id)
    
        if(!property){
            res.status(404).json({message:'Not Found'})
        }else{
            property.imgs.push(req.file.filename)
            await property.save()
            res.status(200).json(property)
        }

    } catch (error) {
        res.status(500).json({message:error.message})
    }
} )

router.patch('/:id',  async(req,res) => {
    try{
        const property1 = await Property.findByIdAndUpdate(req.params.id,req.body)
        const property2 = await property1.save()
        res.status(200).json(property2)
    }catch(err){
        res.status(500).json({ message: err.message})
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const property = await Property.findById(req.params.id)
        await property.remove()
        res.status(200).json(property)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router