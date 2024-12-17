const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    idProduct: { type: String, ref: 'products', required: true },
    idUser: { type: String, ref: 'users', required: true },
    quantityCart: { type: String, required: true },
    totalCart: { type: String, required: true },
    sizeCart: { type: String, required: true },
    colorCart: { type: String, required: true }
});

module.exports = mongoose.model('carts', CartSchema);
