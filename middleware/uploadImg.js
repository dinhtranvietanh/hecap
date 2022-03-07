const fs = require('fs');


module.exports = async function (req, res, next) {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: "There 's no files uploaded " })
        const file = req.files.file;
        console.log(file)

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "oversize file " })
        }
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "wrong format " })
        }
        next()

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}
