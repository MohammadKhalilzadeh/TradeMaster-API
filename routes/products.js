const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')
const { log } = require('console')

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

// used in web
router.get('/', async (req,res) => {
    try{
        const ps = await Product.find()
        res.json(ps)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/suggests', async (req,res) => {
    try{
        const ps = await Product.find().limit(3).exec()
        res.json(ps)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

// used in web
router.get('/buy', async (req,res) => {
    try{
        const ps = await Product.find().where("available").equals(true)
        res.json(ps)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

// used in web
router.get('/:id',getProduct, async (req,res)=>{
    res.send(res.p)
})

// used in web
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

// used in web
router.post('/search',  async(req,res)=>{
    try {
        console.log(req.body.search)
        let search = req.body.search
        let find = await Product.find({ name: { $regex:new RegExp( '.*'+ search +'.*','i') } }).limit(10).exec()
        res.send(find)
        // const result = await User.find({phone: req.body.search}).exec()
        // console.log(result);
        // res.json(result)
    } catch (error) {
        res.json(error)
    }
})

// used in web
router.delete('/:id', checkAuth, getProduct, async (req,res) => {
    try {
        fs.unlinkSync( path.join(__dirname,'../'+ res.p.imagename));
        await res.p.remove()
        res.status(200).json({message:'Deleted the Product'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
})

// used in web
router.patch('/:id', checkAuth, async(req,res) => {
    const product = await Product.findById(req.params.id)
    try{
        if (!product) {
            res.status(404).json({ message: 'No Such Product'})
        }else{
            let field = req.body.field
            product[field] = req.body.value;
            console.log(product);
            await product.save()
            res.status(200).json(product)
        }
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