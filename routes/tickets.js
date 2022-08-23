const express = require('express')
const router = express.Router()
const Tickets = require('../models/tickets')
const checkAuth = require('../middleware/check-auth')

// used in web
router.get('/', async (req,res) => {
    try {
        const tickets = await Tickets.find().where('seen').equals(false)
        res.json(tickets)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.get('/:id', getTicket , async(req,res) => {
    res.send(res.ticket)
})

// used in web
router.post('/search',  async(req,res)=>{
    try {
        console.log(req.body.search)
        let search = req.body.search
        let find = await Tickets.find({ lastname: { $regex:new RegExp( '.*'+ search +'.*','i') } }).limit(10).exec()
        res.send(find)
        // const result = await User.find({phone: req.body.search}).exec()
        // console.log(result);
        // res.json(result)
    } catch (error) {
        res.json(error)
    }
})

// used in web
router.post('/', async(req,res) => {
    try {
        const ticket = new Tickets(req.body)
        await ticket.save()
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// used in web
router.patch('/:id', getTicket, checkAuth, async  (req, res) => {
    try {
        res.ticket.seen = req.body.seen
        console.log(req.body);
        console.log(res.ticket);
        const updatedTicket = await res.ticket.save()
        res.status(200).json(updatedTicket)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

router.delete('/:id', getTicket, checkAuth, async(req,res) => {
    try{
        await res.ticket.remove()
        return res.status(200).json({message: 'Deleted'})
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

async function getTicket(req,res,next) {
    let ticket
    try {
        ticket = await Tickets.findById(req.params.id)
        if(ticket == null) {
            return res.status(404).json({ message: 'No Such Ticket Found'})
        }
    } catch (error) {
        return res.status(500).json({ message:error.message})
    }
    res.ticket = ticket
    next()
}

module.exports = router