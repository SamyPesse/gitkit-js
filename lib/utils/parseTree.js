var STATE_MODE = 0,
    STATE_NAME = 1,
    STATE_HASH = 2;

function modeIsTree(mode) {
    return mode == 16384;
}

function parseTree(buf) {
    var idx = 0,
        len = buf.length,
        state = STATE_MODE,
        start = 0,
        end_mode = 0,
        end_name = 0,
        members = [],
        _byte;

    while(idx < len) {
        _byte = buf[idx++];
        switch(state) {
        case STATE_MODE: mode(); break;
        case STATE_NAME: name(); break;
        case STATE_HASH: hash(); break;
        }
    }

    return members;

    function mode() {
        if(_byte !== 32) {
            return;
        }
        end_mode = idx;
        state = STATE_NAME;
    }

    function name() {
        if(_byte !== 0) {
            return;
        }
        end_name = idx;
        state = STATE_HASH;
    }

    function hash() {
        if(idx - end_name < 20) {
            return;
        }

        var memberMode = parseInt(buf.slice(start, end_mode - 1).toString('utf8'), 8);

        members.push({
            mode: memberMode,
            path: buf.slice(end_mode, end_name - 1).toString('utf8'),
            sha: buf.slice(end_name, idx).toString('hex'),
            type: modeIsTree(memberMode)? 'tree' : 'blob'
        });

        start = idx;
        state = STATE_MODE;
    }
}
module.exports = parseTree;
