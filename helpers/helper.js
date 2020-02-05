const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");


const helper = {
    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    },

    comparePassword(hashPassword, password) {
        return bcrypt.compareSync(password, hashPassword);
    },

    generateToken(payload) {
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "20d" });
        return token;
    }
};

module.exports = helper;
