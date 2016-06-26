var is = require('is');
var Immutable = require('immutable');

/*
    ProgressLine is an utility send to promise's progress
    to normalize logging in the output.
*/

var TYPES = {
    // Is writing a file on the disk
    FILES_WRITE:        'files:write',

    // Is fetching an object from a remote repository
    FETCH_OBJECT:       'fetch:object'
};


var ProgressLine = Immutable.Record({
    type: String(),
    props: Immutable.Map()
});

ProgressLine.prototype.getType = function() {
    return this.get('type');
};

ProgressLine.prototype.getProps = function() {
    return this.get('props');
};

ProgressLine.prototype.getMessage = function() {
    var type = this.getType();
    var props = this.getProps();

    var message = 'Unknown';
    var progress;

    if (type === TYPES.FILES_WRITE) {
        message = 'Writing file "' + props.get('filename') + '"';
    } else if (type === TYPES.FETCH_OBJECT) {
        message = 'Fetching object ' + props.get('index') + '/' + props.get('total');
        progress = props.get('index') / props.get('total');
    }

    if (is.number(progress)) {
        message = '[' + (progress * 100).toFixed(0) + '%] ' + message;
    }

    return message;
};

/*
 * Create a progress line for a promise
 * @return {Object}
 */
function createProgressLine(type, props) {
    return new ProgressLine({
        type: type,
        props: new Immutable.Map(props)
    });
}

function createFilesWrite(filename) {
    return createProgressLine(TYPES.FILES_WRITE, {
        filename: filename
    });
}

function createFetchObject(objIndex, objTotal) {
    return createProgressLine(TYPES.FETCH_OBJECT, {
        index: objIndex,
        total: objTotal
    });
}

module.exports = createProgressLine;
module.exports.TYPES = TYPES;

module.exports.WriteFile = createFilesWrite;
module.exports.FetchObject = createFetchObject;
