var express = require('express');
var router = express.Router();

const usersRouter = require('./users');
const productsRouter = require('./products');
const allyRouter = require('./allies');

const coursesRouter = require('./courses');
const employeesRouter = require('./employees');
const internsRouter = require('./interns');
const ticketsRouter = require('./tickets');
const billsRouter = require('./bills');
const flsRouter = require('./freelance');
const businessRouter = require('./business');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index',{title:' Payment Completed ', refID:'123456789' , message:"مشتری گرامی تریدمستر پرداخت شما با موفقیت انجام شد، لطفا برای کسب اطمینان و پیگیری های مربوطه در صورت بروز مشکل کد پیگیری خود را یادداشت و یا از صفحه اسکرین شات بگیرید", isdone:true});
});

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/ally', allyRouter);
router.use('/courses', coursesRouter);
router.use('/employees', employeesRouter);
router.use('/interns', internsRouter);
router.use('/tickets', ticketsRouter);
router.use('/bills', billsRouter);
router.use('/fls', flsRouter);
router.use('/business', businessRouter);

module.exports = router;
