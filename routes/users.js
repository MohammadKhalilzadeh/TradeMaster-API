const { response } = require('express')
const express = require('express')
const { where, findOne, findByIdAndUpdate } = require('../models/user')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')

const TrezSmsClient = require("trez-sms-client")
const client = new TrezSmsClient("MohammadKh77","13771377")

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

// used in web
router.get('/unverifieds', checkAuth,  async (req, res) => {
    try{
        const users = await User.find().where('verified').equals(false)
        return res.status(200).json(users)
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// used in phone
router.get('/:id', getUser,  async  (req, res) => {
    return res.status(200).send(res.user)
})

// used in phone
router.post('/getcode/:phone', async (req,res)=>{
    try {
        const user = await User.findOne().where('phone').equals(req.params.phone)
        if(!user){
            res.status(404)
        }else{
            client.autoSendCode(user.phone,"TradeMaster Code")
            .catch(err => res.status(500).json(err))

            res.status(200).json(user)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
} )

// used in phone
router.post('/chkcode/:phone', async (req,res)=>{
    try {
        const user = await User.findOne().where('phone').equals(req.params.phone)
        client.checkCode(req.params.phone,req.body.code)
        .then((isvalid) => {
            if(isvalid){
                return res.status(200).json(user)
            }else{
                return res.status(404);
            }
        }).catch(err => {
            res.status(500).json(err)
        })
    } catch (error) {
        res.status(500).json(error)
    }
} )

// used in phone
router.patch('/chngpass/:id', async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(user){
            bcrypt.hash(req.body.password,10,async(err,hash)=>{
                if(err){
                    res.status(500).json(err)
                }else{
                    const result = await User.findByIdAndUpdate(user.id,{
                        password:hash
                    })

                    await result.save().then(end => {
                        res.status(200).json(end)
                    }).catch(err => {
                        res.status(500).json(err)
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}  )

// used in phone
router.post('/loginroute/:input', async  (req, res) => {
    User.findOne({ phone: req.params.input })
    .exec()
    .then(user => {
        if(!user){
            return res.status(404).json({
                message: 'Not Found'
            })
        }
        else{
            bcrypt.compare(req.body.password, user.password,(err,result)=>{
                if(err || result==false){
                    console.log("3");
                    return res.status(401).json({
                        message: 'Unauthorized'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        "id":user._id,
                    } ,
                    "tm4ever"
                    ,{ expiresIn: "24h" }, )
                    user.token = token
                    console.log(user);
                        return res.status(200).json(user)
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: err})
    })

})

// used in phone
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
                            res.status(200).json(result)
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
        res.status(500).json({message:error.message})
    }
})

// used in web
router.post('/search',  async(req,res)=>{
    try {
        console.log(req.body.search)
        let search = req.body.search
        let find = await User.find({ phone: { $regex:new RegExp( '.*'+ search +'.*','i') } }).limit(10).exec()
        res.send(find)
        // const result = await User.find({phone: req.body.search}).exec()
        // console.log(result);
        // res.json(result)
    } catch (error) {
        res.json(error)
    }
})

// used in phone
router.patch('/ident/:id', checkAuth,  async  (req, res) => {
    try {
        const user1 = await User.findByIdAndUpdate(req.params.id,
            req.body,
        )

        const updatedUser = await user1.save()
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message})
    }
})

// uploading imgs
router.post('/images/pics/:id', upload.single('image'),/* checkAuth,*/ async (req,res) => {

    try {

        const user = await User.findById(req.params.id)
    
        if(!user){
            res.status(404).json({message:'Not Found'})
        }else{
            user.imgs.push(req.file.filename)
            await user.save()
            res.status(200).json(user)
            console.log("Done");
        }
    } catch (error) {
        res.status(500).json({message:error.message})
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

// used in web
router.put('/verify/:id', checkAuth,  async  (req, res) => {

    try {
        const user1 = await User.findByIdAndUpdate(req.params.id, {
            verified: true ,
        })

        const updatedUser = await user1.save()
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