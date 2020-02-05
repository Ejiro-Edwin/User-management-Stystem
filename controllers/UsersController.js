const helper = require("../helpers/helper");
const {sendEmail} = require("../helpers/sendmail");
const {User} = require("../model/user");
var btoa = require("btoa");
var atob = require("atob");

const { registerUserSchema, loginSchema } = require("../helpers/validation");
const endPoint = "http://localhost:2020/api/v1/users";



class Users {
    static async addNewUser(req, res) {
        const fieldError = registerUserSchema(req.body);
        if (fieldError.error) return res.status(400).send(fieldError.error.details[0].message);

        const hashedPassword = helper.hashPassword(req.body.password);

        const UserData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hashedPassword,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            company: req.body.company,
            website: req.body.website,
            dob: req.body.dob,
            isVerify:0,
            isDelete:0
        };

        try {
            const result = await User.findOne({ email: req.body.email } );
            console.log(result);
            if (result) {
                res.status(400).send({ error: "User already exists" });
            } else {
                const user = await User.create(UserData);
                console.log(user.id);
                console.log(user)
                let link = `${endPoint}/confirmation/${btoa(user.email)}`;
                if (user) {
                    let msg = `Dear ${user.firstname},\n\n<br/>Your account has been registered, click on the link below to activate your account. <br/>
                      \n
                      <br/><a href="${link}">${link}</a>
                      <br/>
                      <br/>Kind Regards,\n
                      <br/>User Management System`;

                    sendEmail(user.email, "Account Registration !", msg);
                    res.status(200).send({ msg: user.email + " Registered Successfully" });
                } else {
                    res.status(501).send("bad request");
                }
            }
        } catch (error) {
            res.send("error:" + error);
        }
    }

    static async login(req, res) {
        const fieldError = loginSchema(req.body);
        if (fieldError.error) return res.status(400).send(fieldError.error.details[0].message);

        const loginData = {
            email: req.body.email,
            password: req.body.password
        };

        try {
            const user = await User.findOne({ email: req.body.email } );
console.log(user)
            if (user) {
                if (!helper.comparePassword(user.password, req.body.password)) {
                    return res.status(400).json({ message: "The credentials you provided are incorrect" });
                }
                else if(user.email && user.isVerify == 0){
                    return res.status(401).json({ message: "You are yet to confirm your email address" });
                }
                 else {
                    loginData.userId = user.id;
                    loginData.email = user.email;
                    delete loginData.password;
                    const token = helper.generateToken(loginData);
                    return res.status(200).json({ token: token, message: "Login successful" });
                }
            } else {
                res.status(400).send("User does not exist");
            }
        } catch (error) {
            res.send("error: " + error);
        }
    }

    static async activateAccount(req, res) {
        let note = 1;
        try {
            const result = await User.findOneAndUpdate({email:atob(req.params.email)},
                {
                    isVerify: note
                }, { new: true });
            if (result) {
                res.status(200).json({ message: `${atob(req.params.email)}  Account activated successfully` });
            }
        } catch (error) {
            res.send("error: " + error);
        }
    }

    static async ResetPassword(req, res) {
        const oldPassword = req.body.oldPassword;

        try {
            const result = await User.findOne({ email: req.params.email }, {raw: true });
            if (!result) {
                return res.status(400).send({ error: "No user found with that email address." });
            } else {
                if (!helper.comparePassword(result.password, oldPassword)) {
                    return res.json({ status: 400, message: "Incorrect Password" });
                }
                const newPassword = helper.hashPassword(req.body.newPassword);
                const updatedPassword = await User.findOneAndUpdate({ email: req.params.email }  ,{password: newPassword } ,{
                  new: true
                });

                if (updatedPassword) res.send({ status: 200, message: "Password Reset Sucessfully", data: result.password });

                res.send({ status: 501, message: "Password cannot be updated" });
            }
        } catch (error) {
            res.send("error: " + error);
        }
    }
    static async getAllUsers(req, res) {
        try {
            const result = await User.find();
            console.log(result)
            if (result) {
                return res.status(200).send({ status: 200, data: result });
            } else {
                res.status(400).send({ msg: "No user found" });
            }
        } catch (error) {
            res.send("error:" + error);
        }
    }
    static async getOneUser(req, res) {
        try {
            const result = await User.findById(req.params.id);;
            console.log(result)
            if (result) {
                return res.status(200).send({ status: 200, data: result });
            } else {
                res.status(400).send({ msg: "No user found" });
            }
        } catch (error) {
            res.send("error:" + error);
        }
    }
    static async getOneUserByEmail(req, res) {
        try {
            const result = await User.findOne({email:req.params.email});;
            console.log(result)
            if (result) {
                return res.status(200).send({ status: 200, data: result });
            } else {
                res.status(400).send({ msg: "No user found" });
            }
        } catch (error) {
            res.send("error:" + error);
        }
    }
    static async deleteUser(req, res) {
        try {
            const result = await User.findByIdAndUpdate(req.params.id ,{ isDelete: 1 } );
            if (result) {
                return res.status(200).send({ status: 200, data: result });
            } else {
                res.status(400).send({ status: 400, msg: "Unable to delete swot" });
            }
        } catch (error) {
            res.send("error:" + error);
        }
    }

}
module.exports = Users;
