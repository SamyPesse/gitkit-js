var through = require('through2');

var TYPES = {
    FLUSH: 'pkt-flush',
    LINE: 'pkt-line',
    PACKFILE: 'packfile',
    PROGRESS: 'progress',
    ERROR: 'error'
};

function divineClientCapabilities(buf) {
    for (var i = 0, len = buf.length; i < len; ++i) {
        if(buf[i] === 0) {
            break;
        }
    }

    if (i === len) {
        return null;
    }

    return {
        idx: i,
        caps: buf.slice(i+1, buf.length - 1).toString('utf8').split(' ')
    };
}

function divineServerCapabilities(buf) {
    var i, len;
    var isFetch = buf.slice(0, 4).toString() === 'want';

    if (isFetch) {
        for (i = 45, len = buf.length; i < len; ++i) {
            if(buf[i] === 32) {
                break;
            }
        }
    } else {
        for (i = 0, len = buf.length; i < len; ++i) {
            if(buf[i] === 0) {
                break;
            }
        }
    }

    if(i === len) {
        return null;
    }

    return {
        idx: i,
        caps: buf.slice(i+1, buf.length - 1).toString('utf8').split(' ')
    };
}


/*
    Parse metadata (type and caps) from a stream of pkt-lines.
    When capabilities are found, each lines after will have a "caps" property.

    @param {Boolean} serverMode: true if results come from the server
    @return {Stream<Buffer>}
*/
function parsePktLineMeta(serverMode) {
    var caps = null;
    var lineIndex = 0;

    serverMode = !!serverMode;
    var divineCapabilities = serverMode? divineServerCapabilities : divineClientCapabilities;

    // On which line shuld we look for capabilities?
    var checkCapsOn = serverMode ? 1 : 0;

    return through.obj(function(line, enc, callback) {
        var resultType;
        var result = line;

        // Detect type
        if (line.length === 0) {
            resultType = TYPES.FLUSH;
        } else {
            var peek = line[0];
            resultType = peek === 1 ? TYPES.PACKFILE :
                peek === 2 ? TYPES.PROGRESS :
                peek === 3 ? TYPES.ERROR : TYPES.LINE;
        }

        // Should we look for capabilities
        if(!caps && lineIndex === checkCapsOn) {
            caps = divineCapabilities(result) ;
            if (caps) {
                result = result.slice(0, caps.idx + 1);
                result[result.length - 1] = 0x0A;
                caps = caps.caps;
            }
        }

        // Remove first byte to define type
        if (resultType !== TYPES.LINE) {
            result = result.slice(1);
        }

        result.type = resultType;
        result.caps = caps;

        lineIndex++;

        if (resultType === TYPES.FLUSH) {
            lineIndex = 0;
            caps = null;
        } else if (resultType === TYPES.PROGRESS || resultType === TYPES.ERROR) {
            this.emit(resultType, result);
        }

        callback(null, result);
    });
}

module.exports = parsePktLineMeta;
module.exports.TYPES = TYPES;
