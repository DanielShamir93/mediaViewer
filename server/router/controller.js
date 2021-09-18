const UploadModel = require('../database/schema');
const fs = require('fs');

let upload_msg = [];

exports.home = async (req, res, next) => {
    const images = await UploadModel.find();
    res.render('main', { images, upload_msg }); // render main from 'view engine' back to the user
}

exports.uploads = (req, res, next) => {
    const files = req.files;

    if (!files) {
        const err = new Error('Please choose files');
        err.httpStatusCode = 400;
        return next(err);
    }

    //convert images into base64 encoding
    let imgArr = files.map(file => {
        let img = fs.readFileSync(file.path);
        return img.toString('base64');
    });

    let resultArr = imgArr.map((src, index) => {
        // create object to store data in the database
        let finalImg = {
            filename: files[index].originalname,
            contentType: files[index].mimetype,
            imageBase64: src
        }
        let newUpload = new UploadModel(finalImg);
        return newUpload
            .save()
            .then(() => {
                upload_msg.push(files[index].originalname + ' uploaded successfully.');
            })
            .catch(err => {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        // return Promise.reject({err: `Duplicate ${files[index].originalname}. File already exists!`});
                        upload_msg.push(files[index].originalname + ' already exists.');
                    } else {
                        // return Promise.reject({err: err.massage || `Cannot Upload ${files[index].originalname}. Something missing!`});
                        upload_msg.push('Cannot upload' + files[index].originalname + '.');
                    }
                }
            });
    });

    Promise.all(resultArr)
        .then(msg => {
            res.redirect('/');
        })
        .catch(err => {
            // res.json(err);
            res.redirect('/');
        });
}