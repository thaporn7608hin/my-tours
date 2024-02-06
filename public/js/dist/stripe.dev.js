"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bookTour = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var bookTour = function bookTour(tourId) {
  var session;
  return regeneratorRuntime.async(function bookTour$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])("/api/v1/bookings/checkout-session/".concat(tourId)));

        case 3:
          session = _context.sent;
          console.log(session.data.session.url);
          window.location.assign(session.data.session.url);
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

exports.bookTour = bookTour;