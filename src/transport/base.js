// @flow

var Promise = require('q');

class Transport {
    open() : Promise {
        return Promise();
    }

    close() : Promise {
        return Promise();
    }

    /**
     * Get a pack from the server using "git-upload-pack"
     * @param {String} resource
     * @return {Promise<Buffer>}
     */
    getWithUploadPack(resource: string) : Promise<stream$Readable> {

    }

    /**
     * Get a pack from the server using "git-upload-pack"
     * @param {Buffer} data
     * @return {Promise<Buffer>}
     */
    uploadPack(data: Buffer) : Promise<stream$Readable> {

    }
}

module.exports = Transport;
