"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("html-to-text"),
    htmlToText = _require.htmlToText;

var nodemailer = require("nodemailer");

var sgMail = require('@sendgrid/mail');

var pug = require("pug");

module.exports =
/*#__PURE__*/
function () {
  function Email(user, url) {
    _classCallCheck(this, Email);

    this.to = user.email;
    this.firstName = user.name.split('  ')[0];
    this.url = url;
    this.from = "Paine Kung";
  }

  _createClass(Email, [{
    key: "newTransport",
    value: function newTransport() {
      return nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "thaporn7608@gmail.com",
          pass: process.env.PASSWORDS_EMAIL
        }
      });
    }
  }, {
    key: "sent",
    value: function sent(template, subject) {
      var html, mailOptions;
      return regeneratorRuntime.async(function sent$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              html = pug.renderFile("".concat(__dirname, "/../views/emails/").concat(template, ".pug"), {
                firstName: this.firstName,
                url: this.url,
                subject: subject
              });
              mailOptions = {
                to: this.to,
                from: {
                  name: this.from,
                  address: "thaporn7608@gmail.com"
                },
                subject: subject,
                html: html,
                text: htmlToText(html, {
                  wordwrap: 130
                })
              };
              _context.next = 4;
              return regeneratorRuntime.awrap(this.newTransport().sendMail(mailOptions));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendWelcome",
    value: function sendWelcome() {
      return regeneratorRuntime.async(function sendWelcome$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(this.sent('welcome', 'Welcome to the Natours Family!'));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sentPasswordReset",
    value: function sentPasswordReset() {
      return regeneratorRuntime.async(function sentPasswordReset$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.sent("passwordReset", "your password reset token (valid for only 10 minute)");

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Email;
}();