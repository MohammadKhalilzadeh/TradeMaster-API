const { response } = require('express')
const express = require('express')
const { where, findOne } = require('../models/user')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/userspics')
    },
    filename:(req, file, cb) => {
        cb(null, 'usrpic_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

// Getting all
router.get('/',/* checkAuth, */ async (req, res) => {
    try{
        const users = await User.find()
        return res.status(200).json(users)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting One
router.get('/:id', getUser,/* checkAuth,*/ async  (req, res) => {
    return res.status(200).send(res.user)
})

// Get by Email or Phone
router.post('/single/:input', async  (req, res) => {
    console.log("GOT");
    User.findOne().or([{ phone: req.params.input },{email:req.params.input}])
    .exec()
    .then(user => {
        if(!user){
            console.log("No such user");
            return res.status(404).json({
                message: 'Not Found'
            })
        }
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if(err){
                console.log("Un-matched password");
                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            if(result){
                console.log("You're In");
                const token = jwt.sign({
                    "id":user._id,
                } ,
                "tm4ever"
                ,{ expiresIn: "1h" }, )
                    return res.status(202).json({token:token})
                }
            //  res.status(401).json({
            //     message: 'Auth Failed'
            // })
            // console.log("BCRYPT");
            // console.log("5");
        })
    })
    .catch(err => {
        console.log("Error");
        res.status(500).json({ error: err})
    })

})

// Creating One
router.post('/',  async (req, res) => {

    try {
        User.find({$or: [{email: req.body.email}, {phone: req.body.phone}]})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Conflict'
                })
            } else {
                bcrypt.hash(req.body.password,10, async (err,hash) => {
                    if(err){
                        res.status(503).json({
                            error:err
                        })
                    }else{
                        const user = new User({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            phone: req.body.phone,
                            password:hash ,
                        })
                        //const newuser =
                        await user.save().then(result => {
                            res.status(201).json(result)
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err})
                        })
                        // res.status(200).json(newuser)
                    }
                })
            }
        })
        .catch()

    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

router.post('/search/:phone',  async(req,res)=>{
    try {
        console.log(req.params.phone)
        const result = await User.find({phone: req.params.phone}).exec()
        console.log(result);
        res.json(result)
    } catch (error) {
        res.json(error)
    }
})

// Updating One
router.put('/ident/:id', checkAuth,  async  (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        const user1 = await User.findByIdAndUpdate(req.params.id, {
            city:req.body.city,
            province:req.body.province,
            sheba:req.body.sheba,
            address:req.body.address,
            postalcode:req.body.postalcode,
        })

        console.log(user1);
        const updatedUser = await user1.save()
        console.log(updatedUser);
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

// uploading imgs
router.post('/images/pics/:id', upload.single('image'),/* checkAuth,*/ async (req,res) => {

    const user = await User.findById(req.params.id)
    user.imgs.push(req.file.path)
    try {
        await user.save()
        res.status(200).json(user)
    } catch (error) {
        res.json(error)
    }
})

router.delete('/images/:id/:filename', async(req,res)=> {
    fs.unlinkSync(path.join(__dirname, "./uploads/userpics/", req.params.filename));
    const user = await User.findById(req.params.id);
    const index= user.imgs.findIndex(val => val == req.params.filename);
    user.imgs.splice(index, 1)
    res.send(await user.save())
})

router.get("/images/:fileName", async (req, res) => {
    res.sendFile(path.join(__dirname, "./uploads/userpics/", req.params.fileName));
  });

// verifying user
router.put('/verify/:id',/* checkAuth, */ async  (req, res) => {

    try {
        console.log(req.header);
        const user1 = await User.findByIdAndUpdate(req.params.id, {
            verified: true ,
        })

        console.log(user1);
        const updatedUser = await user1.save()
        console.log(updatedUser);
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

// Deleting One
router.delete('/:id', getUser, checkAuth,  async (req, res) => {
    try {
        await res.user.remove()
        res.status(200).json({ message: 'Deleted user' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.user = user
    next()
}

module.exports = router