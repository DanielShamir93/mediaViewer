const mongoose = require('mongoose');

// create structure of mongodb database
const mediaSchema = new mongoose.Schema({
    fileName: {
        type: String,
        unique: true,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    imageBase64: {
        type: String,
        required: true
    }
});

// set the structure from above to files from uploads directory
MediaModel = mongoose.model('media', mediaSchema);

module.exports = MediaModel;