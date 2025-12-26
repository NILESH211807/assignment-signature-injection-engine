const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    beforeHash: {
        type: String,
        required: true
    },
    afterHash: {
        type: String,
        required: true
    },
    cloudFileUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('pdf', schema);