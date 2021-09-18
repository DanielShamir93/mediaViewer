const multer = require('multer');

// set storage
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        cb(null, file.originalname);
    }
})

store = multer({
    storage
})

module.exports = store;