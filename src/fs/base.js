// @flow

var Immutable = require('immutable');
var Promise = require('q');

export type FilePath = string;
export type FilePaths = Immutable.List<FilePath>;

function notImplemented() {
    return Promise.reject(new Error('FS method is not implemented'));
}

class FS {
    constructor() {

    }

    readDir(dirpath: FilePath) : FilePaths {
        return notImplemented();
    }

    statFile(filePath: FilePath) : Promise<File> {
        return notImplemented();
    }

    read(filePath: FilePath) : Promise<Buffer> {
        return notImplemented();
    }

    write(filePath: FilePath, buf: Buffer) : Promise {
        return notImplemented();
    }

    unlink(filePath: FilePath) : Promise {
        return notImplemented();
    }

    mkdir(filePath: FilePath) : Promise {
        return notImplemented();
    }
}

module.exports = FS;
