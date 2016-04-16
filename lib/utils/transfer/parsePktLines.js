var Dissolve = require('dissolve');
var Buffer = require('buffer').Buffer;

/*
    Parse a list of pkt-line

    @return {Stream<Buffer>}
*/
function parsePktLines() {
    return Dissolve()
    .loop(function(end) {
        this.buffer('lineLength', 4)
        .tap(function() {
            var lineLength = parseInt(this.vars.lineLength.toString(), 16);

            if (lineLength === 0) {
                this.push(new Buffer(''));
                return;
            }

            this.buffer('line', lineLength - 4)
            .tap(function() {
                this.push(this.vars.line);
            });
        });
    });
}

module.exports = parsePktLines;
