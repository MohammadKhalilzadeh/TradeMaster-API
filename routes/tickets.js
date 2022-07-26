const express = require('express')
const router = express.Router()
const Tickets = require('../models/tickets')
const checkAuth = require('../middleware/check-auth')

// Will do it in SQL later
router.get('/', async (req,res) => {
    try {
        const tickets = await Tickets.find()
        res.json(tickets)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.get('/:id', getTicket , async(req,res) => {
    res.send(res.ticket)
})

router.post('/', async(req,res) => {
    const ticket = new Tickets({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        desc: req.body.desc,
        email: req.body.email,
    })

    try {
        await ticket.save()
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Updating One
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