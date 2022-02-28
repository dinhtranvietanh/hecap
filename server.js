require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const res = require('express/lib/response')

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

app.use('/user', require('./routes/userRouter'))

//ket noi mgdb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {


    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log("connected to mongodb")
})
app.use('/', (req, res, next) => {
    res.json({ msg: "hi" })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {

})
