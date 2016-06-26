var Promise = require('q');

var SERVICE_UPLOAD_PACK = 'git-upload-pack';
var SERVICE_RECEIVE_PACK = 'git-receive-pack';

class Transport {
    open() : Promise {
        return Promise();
    }

    close() : Promise() {
        return Promise();
    }

    /**
     * Get a pack from the server using "git-upload-pack"
     * @param {String} resource
     * @return {Promise<Buffer>}
     */
    getWithUploadPack(resource: string) : Promise<Buffer> {

    }

    /**
     * Get a pack from the server using "git-upload-pack"
     * @param {Buffer} data
     * @return {Promise<Buffer>}
     */
    uploadPack(data: Buffer) : Promise<Stream> {

    }
}

module.exports = Transport;
module.exports.SERVICE_UPLOAD_PACK = SERVICE_UPLOAD_PACK;
module.exports.SERVICE_RECEIVE_PACK = SERVICE_RECEIVE_PACK;
