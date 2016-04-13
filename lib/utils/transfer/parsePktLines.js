var Immutable = require('immutable');

/*
    Parse a list of pkt-line

    @param {Buffer}
    @return {List<Buffer>}
*/
function parsePktLines(buf) {
    var lines = [];

    function peek(n) {
        var out = buf.slice(0, n);
        buf = buf.slice(n);

        return out;
    }

    function peekLine() {
        if (buf.length === 0) return;

        var contentLength = peek(4);
        contentLength = parseInt(contentLength.toString(), 16);

        if (contentLength > 0) {
            var content = peek(contentLength - 4);
            lines.push(content);
        }

        peekLine();
    }

    peekLine();

    return new Immutable.List(lines);
}

module.exports = parsePktLines;
