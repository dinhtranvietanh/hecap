const cloudinary = require('cloudinary')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


const req = require("express/lib/request");
const res = require("express/lib/response");

const uploadCtrl = {
    uploadAvatar: (req, res) => {
        try {
            const file = req.files.file;
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'avatar', width: 150, height: 150, crop: "fill"
            }, async (err, result) => {
                if (err) throw err;
                removeTmp(file.tempFilePath)

                res.json({ url: result.secure_url })
            })
        } catch (error) {
            return res.status(400).json({ msg: error.message })
        }
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

module.exports = uploadCtrl