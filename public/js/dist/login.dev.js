"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.login = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var login = function login(email, password) {
  var res;
  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
              email: email,
              password: password
            }
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === 'success') {
            _sweetalert["default"].fire({
              title: "<h1 style='font-size: 24px;'>Correct</h1>",
              html: "<div style='font-size: 18px;'>Login success fully</div>",
              icon: "success",
              showConfirmButton: false,
              showCancelButton: false
            });

            window.location.assign("/");
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);

          _sweetalert["default"].fire({
            title: "<h1 style='font-size: 24px;'>Error</h1>",
            html: "<div style='font-size: 18px;'>".concat(_context.t0.response.data.message, "</div>"),
            icon: "error",
            showCancelButton: false,
            showConfirmButton: true,
            dangerMode: true,
            customClass: {
              confirmButton: 'custom-confirm-button',
              cancelButton: 'custom-cancel-button'
            }
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.login = login;

var logout = function logout() {
  var res;
  return regeneratorRuntime.async(function logout$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "GET",
            url: "/api/v1/users/logout"
          }));

        case 3:
          res = _context2.sent;

          if (res.data.status === 'success') {
            _sweetalert["default"].fire({
              html: "<div style='font-size: 18px;'>Logout success fully</div>",
              icon: "success",
              showConfirmButton: false,
              showCancelButton: false
            });

            window.location.assign("/");
          }

          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);

          _sweetalert["default"].fire({
            title: "<h1 style='font-size: 24px;'>Error</h1>",
            html: "<div style='font-size: 18px;'>".concat(_context2.t0.response.data.message, "</div>"),
            icon: "error",
            showCancelButton: false,
            showConfirmButton: true,
            dangerMode: true,
            customClass: {
              confirmButton: 'custom-confirm-button',
              cancelButton: 'custom-cancel-button'
            }
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.logout = logout;