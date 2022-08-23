const express = require('express')
const router = express.Router()
const Item = require('../models/items')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')
const { findByIdAndUpdate } = require('../models/items')

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null,'images/items')
    },
    filename:(req, file, cd) => {
        cd(null, 'item_' + Date.now() + path.extname(file.originalname) )
    },
})

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
    try {
        const item = await Item.find()
        res.json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
} )

// used in phone
router.get('/byowner/:id', async (req, res) => {
    try {
        const item = await Item.find().where('owner').equals(req.params.id)
        console.log(item);
        res.json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
} )

// used in phone
router.get('/:id',  async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        if(!item){
            res.status(404).json({message:'Not Found'})
        }else{
            res.json(item)
        }
    } catch (error) {
        res.json(error.message)
    }
} )

// router.post('/', upload.single('image'), checkAuth, async(req, res) => {
//     const item = new Item(req.body)
//     try {
//         await item.save()
//         res.status(200).json(item)
//     } catch (error) {
//         res.json({ messgae: error.message })
//     }
// } )

// used in phone
router.post('/', checkAuth, async(req, res) => {
    const item = new Item(req.body)
    try {
        console.log(item);
        await item.save()
        res.status(200).json(item)
    } catch (error) {
        res.json({ messgae: error.message })
    }
} )

// used in phone
router.post('/image/:id', upload.single('image'),  async(req, res) => {
    try {

        const item = await Item.findById(req.params.id)
        if(!item){
            res.status(404).json({message:'Not Found'})
        }else{
            item.images.push(req.file.filename)
            await item.save()
            res.status(200).json(item)
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
} )

// used in phone
router.delete('/:id', checkAuth, async(req,res)=>{
    try {
        console.log("1");
        const item = await Item.findById(req.params.id)
        console.log("2");
        if(item.images.length > 0 ){
            fs.unlinkSync(path.join(__dirname,'../'+ item.images ))
        }
        console.log("3");
        await item.remove()
        console.log("4");
        res.status(200).json({message:'Deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
} )

// used in phone
router.patch('/:id', checkAuth, async(req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body)
        await item.save()
        res.status(200).json(item)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

module.exports = router