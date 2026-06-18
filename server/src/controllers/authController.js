const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    try {
        const { name, email, password} = req.body
        const userExist = await User.findOne({ email });

        if(userExist){
            res.status(400)
            throw new Error("Bu email allaqachon ro'yxatdan o'tgan")
        }

        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode)
        throw error
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select('+password')

        if(!user) {
            res.status(401)
            throw new Error(`Email yoki parol noto'g'ri`)
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch){
            res.status(401)
            throw new Error('Email yoki parol notogri')
        }
        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode)
        throw error
    }
}

module.exports = { register, login }