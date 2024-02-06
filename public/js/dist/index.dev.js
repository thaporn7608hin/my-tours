"use strict";

require("@babel/polyfill");

var _login = require("./login");

var _mapBox = require("./mapBox");

var _settings = require("./settings");

var _stripe = require("./stripe");

var map = document.getElementById("map");

if (map) {
  var location = JSON.parse(map.dataset.locations);
  (0, _mapBox.displayMap)(location);
}

var Logout = document.querySelector(".nav__el--logout");
if (Logout) Logout.addEventListener("click", _login.logout);
var loginForm = document.querySelector('.form--login');

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById("password").value;
    (0, _login.login)(email, password);
  });
}

var settingForm = document.querySelector(".form-user-data");

if (settingForm) {
  settingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    (0, _settings.settingUser)(form);
  });
}

var savePassForm = document.querySelector(".form-user-settings");

if (savePassForm) {
  savePassForm.addEventListener("submit", function _callee(e) {
    var passwordCurrent, password, passwordConfirm;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            passwordCurrent = document.getElementById("password-current").value;
            password = document.getElementById("password").value;
            passwordConfirm = document.getElementById("password-confirm").value;
            _context.next = 6;
            return regeneratorRuntime.awrap((0, _settings.updatePassword)(passwordCurrent, password, passwordConfirm));

          case 6:
            document.querySelector(".btn--save-pass").textContent = "Update...";
            setTimeout(function () {
              document.querySelector(".btn--save-pass").textContent = "save password";
            }, 1500);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}

var btnBook = document.getElementById("book-tour");

if (btnBook) {
  btnBook.addEventListener("click", function (e) {
    var tourId = e.target.dataset.tourId;
    (0, _stripe.bookTour)(tourId);
  });
}