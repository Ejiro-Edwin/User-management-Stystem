//load in the required packages
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');

//create mongoose schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    verified: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: Number,
    },
    address: {
        type: String,
    },
    company: {
        type: String,
    },
    website: {
        type: String,
    },
    dob: {
        type: Date,
        default: new Date()
    },
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    return next();
});


userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({ _id: user._id }, jwtSecret)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

// userSchema.methods.sendAuthyToken = (cb) => {
//     const user = this;

//     if (!user.authyId) {
//         // Register this user if it's a new user
//         authy.register_user(user,
//             function (err, response) {
//                 if (err || !response.user) return cb.call(user, err);
//                 user.authyId = response.user.id;
//                 user.save(function (err, doc) {
//                     if (err || !doc) return cb.call(user, err);
//                     user = doc;
//                     sendToken();
//                 });
//             });
//     } else {
//         // Otherwise send token to a known user
//         sendToken();
//     }

//     // With a valid Authy ID, send the 2FA token for this user
//     function sendToken() {
//         authy.request_sms(user.authyId, true, function (err, response) {
//             cb.call(user, err);
//         });
//     }
// };


const User = mongoose.model('User', userSchema)

module.exports = User