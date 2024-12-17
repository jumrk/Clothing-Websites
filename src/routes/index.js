const authRouter = require('./authRouter')
const homeRouter = require('./homeRouter')
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const cartRouter = require('./cartRouter')
const paymentRouter = require('./paymentRouter')
const orderDetails = require('./orderDetailsRouter')
const forgotPassword = require('./forgotPasswordRouter')
const aboutUs = require('./aboutUsRouter');
const admin = require('./adminRouter')
function route(app) {
  app.use('/', homeRouter)
  app.use('/auth', authRouter)
  app.use('/product', productRouter)
  app.use('/user', userRouter)
  app.use('/cart', cartRouter)
  app.use('/payment', paymentRouter)
  app.use('/orderDetail', orderDetails)
  app.use('/forgot-password', forgotPassword)
  app.use('/about-us', aboutUs)
  app.use('/admin', admin)
}
module.exports = route;
