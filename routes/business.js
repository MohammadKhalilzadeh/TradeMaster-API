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

router.get('/', async (req,res) => {
    try{
        const bs = await Business.find()
        res.json(ps)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/:id',getBusiness, async (req,res)=>{
    res.send(res.bs)
})

router.post('/', checkAuth, async (req,res)=>{
    const business = new Business(req.body)
    try{
        await business.save()
        res.status(200).json(business)
    }catch(err){
        res.send(err.message)
    }
})

router.patch('/:id', checkAuth, getBusiness, async(req,res) => {
    try{
        await res.bs.save()
        res.json(res.bs)
    }catch(err){
        res.status(400).json({ message: err.message})
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