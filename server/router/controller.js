const MediaModel = require('../database/schema');
const fs = require('fs');

let serverMsgArr = [];

exports.home = async (req, res, next) => {
    const mediaArr = await MediaModel.find();
    res.render('main', { mediaArr, serverMsgArr }); // render main from 'view engine' back to the user
}


exports.remove = async (req, res, next) => {
    serverMsgArr = [];
    let toRemoveArr = req.body.idArr;

    try {
        await MediaModel.deleteMany({fileName: {$in: toRemoveArr}});
    } catch (err) {
        serverMsgArr.push(err);
    }
    toRemoveArr.forEach(item => {
        serverMsgArr.push(`successfully removed ${item}.`);
    });
    const mediaArr = await MediaModel.find();
    let updatedGalleryArr = [];
    mediaArr.forEach(record => {
        updatedGalleryArr.push(record.fileName);
    });
    res.json({ updatedGalleryArr, serverMsgArr });
    serverMsgArr = [];
    // res.render('main', { mediaArr, serverMsgArr }); // render main from 'view engine' back to the user
}


exports.uploads = (req, res, next) => {
    serverMsgArr = [];
    const files = req.files;

    if (!files) {
        const err = new Error('Please choose files');
        err.httpStatusCode = 400;
        return next(err);
    }

    //convert images into base64 encoding
    let mediaArr = files.map(file => {
        let media = fs.readFileSync(file.path);
        return media.toString('base64');
    });

    let resultArr = mediaArr.map((src, index) => {
        // create object to store data in the database
        let mediaFile = {
            fileName: files[index].originalname,
            contentType: files[index].mimetype,
            imageBase64: src
        }
        return new MediaModel(mediaFile)
            .save()
            .then(() => {
                serverMsgArr.push(files[index].originalname + ' uploaded successfully.');
            })
            .catch(err => {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        // return Promise.reject({err: `Duplicate ${files[index].originalname}. File already exists!`});
                        serverMsgArr.push(files[index].originalname + ' already exists.');
                    } else {
                        // return Promise.reject({err: err.massage || `Cannot Upload ${files[index].originalname}. Something missing!`});
                        serverMsgArr.push('Cannot upload' + files[index].originalname + '.');
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