const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Item = require('../models/items')
const checkAuth = require('../middleware/check-auth')

// used in phone
router.get('/:id', checkAuth ,async(req,res) => {
    console.log(req.params);
    try {
        const categories = await Category.find().where('owner').equals(req.params.id)
        return res.status(200).json(categories)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})

// used in phone
router.post('/', checkAuth ,async(req,res)=>{
    try {
        const category = new Category(req.body)
        await category.save()
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json(error)
    }
})

// used in phone
router.delete('/:id', checkAuth, async(req,res)=>{
    try {
        await Item.deleteMany({ owner: req.params.id })
        const result = await Category.findById(req.params.id)
        await result.remove()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router