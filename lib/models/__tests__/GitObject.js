'use strict';

var _GitObject = require('../GitObject');

var _GitObject2 = _interopRequireDefault(_GitObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('.sha', function () {

    test('it should encode it correctly', function () {
        var o = new _GitObject2.default({
            type: 'blob',
            content: new Buffer('Hello world', 'utf8')
        });

        expect(o.sha).toBe('70c379b63ffa0795fdbfbc128e5a2818397b7ef8');
    });
});