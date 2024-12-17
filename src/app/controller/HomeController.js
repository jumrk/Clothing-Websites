const product = require('../models/Product')
class HomeController {
    home(req, res, next) {
        product.find({})
            .sort({ _id: -1 })
            .limit(4)
            .then(products => {
                products = products.map(product => product.toObject());
                res.render('page/home', { products, title: "Trang chủ", layout: 'main', cssFile: "home.css", jsFile: "home.js" })
            })
            .catch(next)
    }
}

module.exports = new HomeController();