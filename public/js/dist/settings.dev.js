"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = exports.settingUser = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var settingUser = function settingUser(data) {
  var res;
  return regeneratorRuntime.async(function settingUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "PATCH",
            url: "/api/v1/users/updateUser",
            data: data
          }));

        case 3:
          res = _context.sent;

          _sweetalert["default"].fire({
            title: "<h1 style='font-size: 24px;'>Update success</h1>",
            html: "<div style='font-size: 18px;'>Login success fully</div>",
            icon: "success",
            showConfirmButton: false,
            showCancelButton: false
          });

          setTimeout(function () {
            window.location.reload();
          }, 800);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
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

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.settingUser = settingUser;

var updatePassword = function updatePassword(passwordCurrent, password, passwordConfirm) {
  var res;
  return regeneratorRuntime.async(function updatePassword$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "PATCH",
            url: "/api/v1/users/updatePassword",
            data: {
              passwordCurrent: passwordCurrent,
              password: password,
              passwordConfirm: passwordConfirm
            }
          }));

        case 3:
          res = _context2.sent;

          _sweetalert["default"].fire({
            title: "<h1 style='font-size: 24px;'>Update success</h1>",
            html: "<div style='font-size: 18px;'>Login success fully</div>",
            icon: "success",
            showConfirmButton: false,
            showCancelButton: false
          });

          window.location.assign("/");
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
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

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.updatePassword = updatePassword;