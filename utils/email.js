
const {
    htmlToText
} = require("html-to-text")
const nodemailer = require("nodemailer")
const pug = require("pug")

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email
        this.firstName = user.name.split('  ')[0]
        this.url = url
        this.from = "Paine Kung"
    }

    newTransport() {

        return nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "thaporn7608@gmail.com",
                pass: process.env.PASSWORDS_EMAIL
            }

        })



    }


    async sent(template, subject) {

        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })

        const mailOptions = {
            to: this.to,
            from: {
                name: this.from,
                address: "thaporn7608@gmail.com"
            },
            subject,
            html,
            text: htmlToText(html, {
                wordwrap: 130
            })
        };

        await this.newTransport().sendMail(mailOptions)

    }

    async sendWelcome() {
        await this.sent('welcome', 'Welcome to the Natours Family!');
    }

    async sentPasswordReset() {  
        this.sent(
            "passwordReset",
            "your password reset token (valid for only 10 minute)"
        )
    }
}