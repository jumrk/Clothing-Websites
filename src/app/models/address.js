const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    userID: { type: String, require: true },
    address: { type: String, require: true }
});

module.exports = mongoose.model('address', AddressSchema);
