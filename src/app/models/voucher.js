const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoucherSchema = new Schema({
    codeVoucher: { type: String, require: true },
    conditionVoucher: { type: String, require: true },
    valueVoucher: { type: String, require: true }
});

module.exports = mongoose.model('vouchers', VoucherSchema);
