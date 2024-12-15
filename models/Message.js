const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    usuario: String,
    mensaje: String,
    hora: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);