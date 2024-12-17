const Product = require('../models/Product');
const { mongooseToObject } = require('../../util/mongoose');
class ProductController {
    product(req, res, next) {
        Product.find({})
            .then((products) => {
                products = products.map(product => product.toObject())
                res.render('page/product', { products, layout: 'main', title: 'Tất cả sản phẩm' })
            })
            .catch(next)
    }
    produtDetails(req, res, next) {
        const slug = req.params.slug;
        Product.findOne({ slug: slug })
            .then((product) => {
                res.render('page/productDetail', { product: mongooseToObject(product), cssFile: 'productDetail.css', layout: 'main', title: 'Chi tiết sản phẩm' })
            })
            .catch(next)
    };
    renderCategories(req, res, next) {
        let cate = req.params.cate;

        if (cate === 'Áo') {
            Product.find({ categories: { $nin: ['Quần'] } })
                .then((products) => {
                    products = products.map(product => product.toObject());
                    res.render('page/productCategories', {
                        products,
                        cate,
                        layout: 'main',
                        title: cate,
                    });
                })
                .catch(next);
        } else {
            Product.find({ categories: cate })
                .then((products) => {
                    products = products.map(product => product.toObject());
                    res.render('page/productCategories', {
                        products,
                        cate,
                        layout: 'main',
                        title: cate,
                    });
                })
                .catch(next);
        }
    }

}

module.exports = new ProductController();