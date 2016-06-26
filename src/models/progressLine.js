// @flow

var is = require('is');
var Immutable = require('immutable');

/*
 * ProgressLine is an utility send to promise's progress
 * to normalize logging in the output.
 */

const TYPES = {
    // Is writing a file on the disk
    FILES_WRITE:        'files:write',

    // Is fetching an object from a remote repository
    FETCH_OBJECT:       'fetch:object'
};

const defaultRecord: {
    type:  string,
    props: Immutable.Map
} = {
    type:  '',
    props: Immutable.Map()
};

class ProgressLine extends Immutable.Record(defaultRecord) {
    constructor(type: string, props: Immutable.Map | mixed) {
        super({
            type:  type,
            props: new Immutable.Map(props)
        });
    }

    getType() : string {
        return this.get('type');
    }

    getProps() : Immutable.Map {
        return this.get('props');
    }

    getMessage() : string {
        var type = this.getType();
        var props = this.getProps();

        var message = 'Unknown';
        var progress : number;

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
    }

    static WriteFile(filename: string) {
        return new ProgressLine(TYPES.FILES_WRITE, {
            filename: filename
        });
    }

    static FetchObject(objIndex: number, objTotal: number) {
        return new ProgressLine(TYPES.FETCH_OBJECT, {
            index: objIndex,
            total: objTotal
        });
    }
}

module.exports = ProgressLine;
module.exports.TYPES = TYPES;
