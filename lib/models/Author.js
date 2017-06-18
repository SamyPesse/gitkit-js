'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pad = require('pad');

var _pad2 = _interopRequireDefault(_pad);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULTS = {
    name: '',
    email: '',
    timezone: '',
    timestamp: 0
};

var Author = function (_Record) {
    _inherits(Author, _Record);

    function Author() {
        _classCallCheck(this, Author);

        return _possibleConstructorReturn(this, (Author.__proto__ || Object.getPrototypeOf(Author)).apply(this, arguments));
    }

    _createClass(Author, [{
        key: 'toString',
        value: function toString() {
            return this.name + ' <' + this.email + '> ' + this.timestamp + ' ' + this.timezone;
        }
    }], [{
        key: 'createFromPerson',
        value: function createFromPerson(person) {
            var date = new Date();
            var offset = date.getTimezoneOffset();
            var timezone = (offset < 0 ? '+' : '-') + (0, _pad2.default)('' + parseInt(Math.abs(offset / 60), 10), 2) + (0, _pad2.default)('' + Math.abs(offset % 60), 2);

            return new Author({
                name: person.name,
                email: person.email,
                timezone: timezone,
                timestamp: Number(date.getTime() / 1000)
            });
        }
    }]);

    return Author;
}((0, _immutable.Record)(DEFAULTS));

exports.default = Author;