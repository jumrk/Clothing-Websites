const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nameUser: { type: String, required: true },
    emailUser: { type: String, required: true, unique: true },
    passwordUser: { type: String, required: true },
    phoneUser: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

module.exports = mongoose.model('users', UserSchema);
