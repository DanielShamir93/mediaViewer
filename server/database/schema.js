const mongoose = require('mongoose');

// create structure of mongodb database
const uploadSchema = new mongoose.Schema({
    filename: {
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
UploadModel = mongoose.model('uploads', uploadSchema);

module.exports = UploadModel;