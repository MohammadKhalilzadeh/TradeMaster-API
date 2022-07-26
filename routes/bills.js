const express = require('express')
const router = express.Router()
const Bill = require('../models/bills')
const checkAuth = require('../middleware/check-auth')
const zarin = require('./zarinpal');
const zarinex = zarin.create('ab981e2c-1fdf-40af-8229-9f2d22038ebb',false);
const TrezSmsClient = require("trez-sms-client");
const client = new TrezSmsClient("MohammadKh77", "13771377")
const mongoose = require('mongoose');
const { findByIdAndUpdate } = require('../models/bills');

// used in web
router.get('/website/orders', checkAuth,  async (req,res) => {
    try {
        const bills = await Bill.find({ $or: [{ Status:"Pending"},{ Status:"Seen"},{ Status:"On Way"},] }).where("ShopName").equals("TradeMaster")
        return res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// used in phone
router.get('/:id',   async (req,res) => {
    try {
        const bill = await Bill.findById(req.params.id)
        console.log(bill);
        return res.status(200).json(bill)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// used in web
router.get('/website/done', checkAuth,  async (req,res) => {
    try {
        const bills = await Bill.find().where("Status").equals("Delivered")
        console.log(bills);
        return res.status(200).json(bills)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
})

// used in phone
router.get('/customer/:phone', async (req,res) => {
    try {
        console.log(req.params.phone);
        const bills = await Bill.find().where("CustomerPhone").equals(req.params.phone).where("ShopName").ne("TradeMaster")
        // .or([ { Status:"Pending" },{ Status:"Seen"},{ Status:"On Way"} ])
        res.status(200).json(bills)
        console.log(bills.length );
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

router.get('/pending/:input', async(req,res) => {
    try {
        const field = req.body.field
        const bills = await Bill.find().and({ field: req.params.input }).or([ { Status:"Pending" },{ Status:"Seen"},{ Status:"On Way"} ])
        res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// used in phone
router.get('/shoporders/:id', async(req,res) => {
    try {
        const bills = await Bill.find().where("owner").equals(req.params.id).where("ShopName").ne("TradeMaster")
        res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// used in web
router.post('/search',  async(req,res)=>{
    try {
        let search = req.body.search
        console.log(search);
        let find = await Bill.find({ CustomerPhone: { $regex:new RegExp( '.*'+ search +'.*','i') } }).limit(10).exec()
        res.send(find)
    } catch (error) {
        res.json(error)
    }
})

// used in phone
router.post('/', checkAuth,  async (req,res) => {
    console.log("----1");
    zarinex.PaymentRequestWithExtra({
        amount: req.body.TotalPrice,
        callback_url:'http://192.168.152.206:3000/bills/verify/Ex',
        description: "از اعتمادشما به تریدمستر مفتخریم",
        mobile: req.body.CustomerPhone,
        wages:[
            {
                zp_id: "ZP.1090478" ,
                // iban:req.body.owner,
                iban:"IR260120020000005217837375",
                amount:req.body.PartnerShare,
                description:"محصول",
            }
        ],
    }).then(async(response) => {
        console.log("----2");
        if(response.code == 100){
            console.log("----3");
            const bill = new Bill({
                ShopName: req.body.ShopName ,
                CustomerPhone: req.body.CustomerPhone,
                CustomerAddress: req.body.CustomerAddress,
                TotalPrice: req.body.TotalPrice,
                PartnerShare: req.body.PartnerShare,
                owner:req.body.owner,
                items: req.body.items,
                authority:response.authority,
                Datetime:req.body.Datetime,
            })
            try {
                const result = await bill.save()
                res.status(200).json(response);
            } catch (error) {
                console.log("----4");
                console.log(error);
                res.status(500).json({message:error.message})
            }
        }
    })
})

// used in web
router.post('/website', checkAuth,  async (req,res) => {
    console.log("----1");
    zarinex.PaymentRequestWithExtra({
        amount: req.body.TotalPrice,
        callback_url:'http://192.168.1.101:3000/bills/verify/Ex',
        description: "از اعتمادشما به تریدمستر مفتخریم",
        mobile: req.body.CustomerPhone,
        wages:[
            {
                zp_id: "ZP.1090478" ,
                // iban:req.body.owner,
                iban:"IR260120020000005217837375",
                amount:req.body.PartnerShare,
                description:"محصول",
            }
        ],
    }).then(async(response) => {
        console.log("----2");
        if(response.code == 100){
            console.log("----3");
            const bill = new Bill({
                ShopName: req.body.ShopName ,
                CustomerPhone: req.body.CustomerPhone,
                CustomerAddress: req.body.CustomerAddress,
                TotalPrice: req.body.TotalPrice,
                PartnerShare: req.body.PartnerShare,
                owner:req.body.owner,
                item: req.body.item,
                authority:response.authority,
                Datetime:req.body.Datetime,
            })
            try {
                const result = await bill.save()
                res.status(200).json(response);
            } catch (error) {
                console.log("----4");
                console.log(error);
                res.status(500).json({message:error.message})
            }
        }
    })
})

// used in web and phone
router.get('/verify/Ex', async(req, res)=>{
    console.log("---1");
    const bill = await Bill.findOne().and({ authority : req.query.Authority })
    if(req.query.Status == 'OK'){
        console.log("---2");
        zarinex.PaymentVerificationWithExtra({
            amount:bill.TotalPrice,
            authority:  req.query.Authority ,
        }).then(async(response)=>{
            if (response.code == 100) {
                try {
                    console.log("---3");

                    await Bill.findByIdAndUpdate(bill._id,{
                        refID:response.ref_id,
                        code:response.code,
                    })

                    message = 'مشتری گرامی، از اعتماد شما به تریدمستر متشکریم. سفارش شما دریافت و به فروشگاه مورد نظرتان منتقل شد. لطفا آماده‌سازی و تحویل سفارش را از طریق تماس با فروشگاه پیگیری فرمایید. باتشکر از شکیبایی شما'+
                    'شماره پیگیری شما:' + response.ref_id ;

                    var k = parseInt(Math.random()*123412341234*Math.random());

                    client.sendMessage("50002910001080",bill.CustomerPhone,message,k + "-" + k)
                    .then((msg)=>{
                      console.log(msg);
                    });
                    console.log("---4");
                    console.log("---5");
                    res.setHeader("Content-Type", "text/html");
                      res.render('index',{title:'پرداخت موفق', isdone:true , refID:response.ref_id , message:"مشتری گرامی تریدمستر پرداخت شما با موفقیت انجام شد، لطفا برای کسب اطمینان و پیگیری های مربوطه در صورت بروز مشکل کد پیگیری خود را یادداشت و یا از صفحه اسکرین شات بگیرید"});
                } catch (error) {
                    res.json({message:error.message});
                    console.log("---6");
                }
            }else{
                res.status(response.code);
              }
        }).catch((err)=>{
            console.log("---7");
            res.json(err);
          });
    }else{
        console.log("---8");
        res.status(200).render('index',{title:'پرداخت ناموفق',isdone:false , message:"کاربر گرامی متاسفانه به علت مشکل فنی پرداخت شما ناموفق بود. در صورت دریافت هرگونه وجهی طی 72 ساعت آینده به شما بازگردانده میشود"});
        await Bill.findByIdAndUpdate(bill._id,{
            Status:"Failed",
        })
      }
} )

// used in web
router.patch('/chngstatus/:id', checkAuth,  async  (req, res) => {
    const bill = await Bill.findById(req.params.id)
    try {
        if(!bill){
        res.status(400).json({ message: 'No Such Bill'})
        }else{
            let field = req.body.field
            bill[field] = req.body.value;
            console.log(bill);
            await bill.save()
            res.status(200).json(bill)

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message})
    }
})

// used in phone
router.patch('/billstatus/:id', checkAuth,  async  (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).json(bill)
    } catch (error) {
        res.json(error)
    }
})

// used in web
router.delete('/:id', checkAuth,  getBill, async (req, res) => {
    try {
        await res.bill.remove()
        res.status(200).json({ message: 'Deleted user' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getBill(req, res, next) {
    let bill
    try {
        bill = await Bill.findById(req.params.id)
        if (bill == null){
            return res.status(404).json({message: 'Not Found'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.bill = bill
    next()
}

module.exports = router