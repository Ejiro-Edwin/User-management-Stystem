const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique:true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    phoneNumber:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15
    }, 
    address:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }, 
    company:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
     website:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
     }, 
     dob:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
     },
     isVerify: 0,
     isDelete: 0
});

const User = mongoose.model('User', userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;