const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const req = require('express/lib/request')
const res = require('express/lib/response')
const sendEmail = require('./sendMail')
const { CLIENT_URL } = process.env
const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password)
                return res.status(400).json({ msg: "please enter all information" })
            if (!validateEmail(email))

                return res.status(400).json({ msg: "Invalid email!" })

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "Email is already used!" })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password is too short!" })

            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = {
                name, email, password: passwordHash
            }
            const activation_token = createActivationToken(newUser)
            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            sendMail(email, url, "verify email address")
            res.json({ msg: "Successful! please activate your email to start" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const { name, email, password } = user
            const check = await Users.findOne({ email })
            if (check) return res.status(400).json({ msg: "Email is already used!" })
            const newUser = new Users({
                name, email, password
            })
            await newUser.save()

            res.json({ msg: " Account is activated" })
        } catch (error) {
            return res.status(500).json({ msg: err.message })

        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Email does not exist" })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect" })

            const refresh_token = createrRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngay
            })
            res.json({ msg: "login successfully" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAccessToken: (req, res) => {

        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: "Must login now" })
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Must login now" })
                const access_token = createAccessToken({ id: user.id })
                res.json({ access_token })
            })


        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Email does not exist" })
            const access_token = createAccessToken({ id: user._id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`
            sendEmail(email, url, "reset password")
            res.json({ msg: "Check your email to reset password!" })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body
            console.log(password)
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })
            res.json({ msg: "Password changed " })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            res.json(user)
        } catch (error) {
            return res.status(500).json({ msg: err.message })

        }
    },
    getAllUsersInfo: async (req, res) => {
        try {

            const users = await Users.find().select('-password')
            res.json(users)
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "bye" })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, avatar } = req.body
            await Users.findOneAndUpdate({ _id: req.user.id }, { name, avatar })
            res.json({ msg: " Updated " })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateRole: async (req, res) => {
        try {
            const { role } = req.body
            await Users.findOneAndUpdate({ _id: req.params.id }, { role })
            res.json({ msg: " Updated " })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {

            await Users.findByIdAndDelete(req.params.id)
            res.json({ msg: " Deleted " })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    }

}


const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}
const createrRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userCtrl 