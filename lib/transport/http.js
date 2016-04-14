var Q = require('q');
var http = require('http');

var pkg = require('../../package.json');
var BufferUtils = require('../utils/buffer');

var SERVICE_UPLOAD_PACK = 'git-upload-pack';
var SERVICE_RECEIVE_PACK = 'git-receive-pack';

/*
    HTTP/HTTPS Transport for the smart Git protocol.

    @param {String} uri
    @param {Object<user,password>} auth
*/
function HTTPTransport(uri, auth) {
    if (!this instanceof HTTPTransport) {
        return new HTTPTransport(uri, auth);
    }

    this.uri = uri;
    this.http = axios.create({
        baseURL: uri,
        auth: auth,
        headers: {
            'User-Agent': pkg.name+'/'+pkg.version
        }
    });
}

/*
    Open and prepare the connection

    @return {Promise}
*/
HTTPTransport.prototype.open = function() {
    return Q();
};

/*
    Close and cleanup the connection

    @return {Promise}
*/
HTTPTransport.prototype.close = function() {
    return Q();
};

/*
    Get a pack from the server using "git-upload-pack"

    @param {String} resource
    @return {Promise<Buffer>}
*/
HTTPTransport.prototype.fetchPack = function(resource, data) {
    return Q(this.http.get(resource, {
        responseType: 'arraybuffer',
        params: {
            service: SERVICE_UPLOAD_PACK
        }
    }))
    .then(function(response) {
        if (response.headers['content-type'] != 'application/x-'+SERVICE_UPLOAD_PACK+'-advertisement') {
            throw new Error('Invalid content type when fetching pack');
        }

        return response.data;
    });
};

/*
    Send a pack using git service "git-receive-pack"

    @param {String} resource
    @param {Buffer} pack
    @return {Promise}
*/
HTTPTransport.prototype.sendPack = function(resource, data) {
    return Q(this.http.post(resource, {
        responseType: 'arraybuffer',
        params: {
            service: SERVICE_RECEIVE_PACK
        }
    }))
    .then(function(response) {
        if (response.header['content-type'] != 'application/x-'+SERVICE_RECEIVE_PACK+'-advertisement') {
            throw new Error('Invalid content type when fetching pack');
        }
    });
};

/*
    Get a pack from the server using "git-upload-pack"

    @param {String} resource
    @return {Promise<Buffer>}
*/
HTTPTransport.prototype.uploadPack = function(data) {
    var d = Q.defer();

    http.post({
        path : this.uri + '/git-upload-pack',
        headers: {
            'Content-Type': 'application/x-git-upload-pack-request',
            //'Authorization': 'Basic '
        }
    }, function (res) {
        d.resolve(res);
    });


    return d.promise;





    return Q(this.http.post('git-upload-pack', BufferUtils.toArrayBuffer(data), {
        responseType: 'arraybuffer',
        headers: {
            'Content-Type': 'application/x-git-upload-pack-request'
        }
    }))
    .then(function(response) {
        return response.data;
    });
};

module.exports = HTTPTransport;
