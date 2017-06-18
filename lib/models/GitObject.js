'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _sha = require('../utils/sha1');

var _sha2 = _interopRequireDefault(_sha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULTS = {
    type: 'blob',
    content: new Buffer()
};

var GitObject = function (_Record) {
    _inherits(GitObject, _Record);

    function GitObject() {
        _classCallCheck(this, GitObject);

        return _possibleConstructorReturn(this, (GitObject.__proto__ || Object.getPrototypeOf(GitObject)).apply(this, arguments));
    }

    _createClass(GitObject, [{
        key: 'getAsBuffer',


        /*
         * Get entire buffer to represent this object.
         */
        value: function getAsBuffer() {
            var type = this.type,
                content = this.content;


            var nullBuf = new Buffer(1);
            nullBuf.fill(0);

            return Buffer.concat([new Buffer(type + ' ' + content.length, 'utf8'), nullBuf, content]);
        }
    }, {
        key: 'sha',
        get: function get() {
            return _sha2.default.encode(this.getAsBuffer());
        }
    }, {
        key: 'isTree',
        get: function get() {
            return this.type == 'tree';
        }
    }, {
        key: 'isBlob',
        get: function get() {
            return this.type == 'blob';
        }
    }, {
        key: 'isCommit',
        get: function get() {
            return this.type == 'commit';
        }
    }]);

    return GitObject;
}((0, _immutable.Record)(DEFAULTS));

exports.default = GitObject;