const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    nameProduct: { type: String, required: true },
    categories: { type: String, required: true },
    imageProduct: { type: String, required: true },
    descriptionProduct: { type: String, required: true },
    priceProduct: { type: Number, required: true, default: 0 },
    quantityProduct: { type: Number, required: true, default: 0 },
    colorProduct: { type: [String], default: [] },
    sizeProduct: { type: [String], default: [] },
    brandName: { type: String, required: true },
    slug: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('products', ProductSchema);
