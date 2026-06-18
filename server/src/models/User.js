const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: [true, "Ism kritish majburiy"],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email kritish majburiy'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
        type: String,
        required: [true, 'Parol kritish majburiy'], // ← required
        minlength: [6, 'Parol kamida 6 ta belgi'],
        select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        avatar: {
            type: String,
            default: 'user'
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User