const express = require('express')
const router = express.Router()
const Courses = require('../models/courses')
const multer = require('multer')
const path = require('path')
const { log } = require('console')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("4");
        console.log("req.body");
        cb(null, 'images/courses')
    },
    filename:(req, file, cb) => {
        console.log("5");
        console.log("req.body");
        console.log(file);
        cb(null, 'courses_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

router.get('/', async(req,res)=>{
    try {
        const courses = await Courses.find()
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
})

router.get('/:id',getCourse , async(req,res)=>{
    res.send(res.course)
})

router.post('/',upload.single('image') , checkAuth,  async(req,res)=>{
    const course = new Courses({
        title: req.body.title,
        teacher: req.body.teacher,
        capacity: req.body.capacity,
        tuition: req.body.tuition,
        time: req.body.time,
        description: req.body.description,
        poster: req.file.path,
    })

    try {
        await course.save()
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
})

router.delete('/:id',checkAuth, getCourse,   async(req,res)=>{
    try {
        fs.unlinkSync(path.join(__dirname,'../'+ res.course.poster));
        await res.course.remove()
        return res.status(200).json({ message: 'Deleted'})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

async function getCourse(req, res, next){
    let course
    try {
        course = await Courses.findById(req.params.id)
        console.log("1");
        if(course == null){
            console.log("2");
            return res.status(404).json({ message: 'Not Found'})
        }
    } catch (error) {
        console.log("3");
        return res.status(500).json({ message: error.message})
    }

    res.course = course
    next()
}

module.exports = router