var through = require('through2');
var binary = require('binary');

/*
    Parse a list of pkt-line

    @return {Stream}
*/
function parsePktLines() {
    var parseLine = binary()
        .loop(function(end) {
            this.buffer('lineLength', 4)
            .tap(function(vars) {
                var lineLength = parseInt(vars.lineLength.toString(), 16);

                if (lineLength === 0) {
                    output.write(null);
                    return;
                }

                this.buffer('line', lineLength - 4)
                .tap(function(vars) {
                    output.write(vars.line);
                });
            });
        });

    var output = through(function(data, enc, callback) {
        parseLine.write(data);
        callback();
    });

    return output;
}

module.exports = parsePktLines;
