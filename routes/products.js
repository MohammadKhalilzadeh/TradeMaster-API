const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("req.body");
        cb(null, 'images/products')
    },
    filename:(req, file, cb) => {
        console.log("req.body");
        console.log(file);
        cb(null, 'product_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

router.get('/', async (req,res) => {
    try{
        const ps = await Product.find()
        res.json(ps)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/:id',getProduct, async (req,res)=>{
    res.send(res.p)
})

router.post('/', upload.single('image'), checkAuth, async (req,res)=>{
    const prod = new Product({
        name: req.body.name,
        unit: req.body.unit,
        price: req.body.price,
        description: req.body.description,
        available: req.body.available,
        owner:req.body.owner,
        imagename: req.file.path
    })
    try{
        await prod.save()
        res.status(200).json(prod)
    }catch(err){
        res.send(err.message)
    }
})

router.delete('/:id', checkAuth, getProduct, async (req,res) => {
    try {
        fs.unlinkSync( path.join(__dirname,'../'+ res.p.imagename));
        await res.p.remove()
        res.json({message:'Deleted the Product'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
})

router.patch('/:id', checkAuth, getProduct, async(req,res) => {
    try{
        await res.p.save()
        res.json(res.p)
    }catch(err){
        res.status(400).json({ message: err.message})
    }
})

async function getProduct(req, res, next) {
    let p
    try {
        p = await Product.findById(req.params.id)
        if (p == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.p = p
    next()
}

module.exports = router