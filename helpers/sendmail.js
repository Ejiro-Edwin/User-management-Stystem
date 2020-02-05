const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

async function sendEmail(to, subject, html) {
    sgMail.setApiKey(keys.sendgridKey);
    const mail = {
        from: "ejiroedwin@gmail.com",
        to,
        subject,
        text: html.replace(/<[^>]*>?/gm, ""),
        html
    };
    var res = await sgMail.send(mail);
    return res;
}

module.exports = { sendEmail };
