var Promise = require('q');
var http = require('http');
var https = require('https');
var url = require('url');
var querystring = require('querystring');

var pkg = require('../../package.json');

var SERVICE_UPLOAD_PACK = 'git-upload-pack';
// var SERVICE_RECEIVE_PACK = 'git-receive-pack';

/**
 * HTTP/HTTPS Transport for the smart Git protocol.
 *
 * @param {String} uri
 * @param {Object<user,password>} auth
 */
function HTTPTransport(uri, auth) {
    if (!this instanceof HTTPTransport) {
        return new HTTPTransport(uri, auth);
    }

    this.uri = uri;
    this.auth = auth;
}

/**
 * Open and prepare the connection
 * @return {Promise}
 */
HTTPTransport.prototype.open = function() {
    return Promise();
};

/**
 * Close and cleanup the connection
 * @return {Promise}
 */
HTTPTransport.prototype.close = function() {
    return Promise();
};

/**
 * Execute an HTTP request
 * @param {String} method
 * @param {String} uri
 * @param {Object<headers>} opts
 * @return {Promise<Stream>}
 */
HTTPTransport.prototype.request = function(method, uri, opts) {
    var d = Promise.defer();
    opts = opts || {};
    opts.headers = opts.headers || {};

    // Set authorization headers
    if (this.auth) {
        opts.headers['Authorization'] = 'Basic ' + new Buffer(this.auth.user + ':' + this.auth.password)
            .toString('base64');
    }

    // Set user agent
    opts.headers['User-Agent'] = pkg.name + '/' + pkg.version;

    // Parse url
    var parsed = url.parse(this.uri + '/' + uri);

    // Setup agent
    var agent = parsed.protocol == 'https:'? https : http;

    var req = agent.request({
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.path,
        method: method,
        headers: opts.headers
    }, function (res) {
        d.resolve(res);
    });

    // Send request
    req.end(opts.body);

    return d.promise;
};

/**
 * Get a pack from the server using "git-upload-pack"
 * @param {String} resource
 * @return {Promise<Buffer>}
 */
HTTPTransport.prototype.getWithUploadPack = function(resource, data) {
    resource = resource + '?' + querystring.stringify({
        service: SERVICE_UPLOAD_PACK
    });

    return this.request('GET', resource, {
        headers: {
            'Content-Type': 'application/x-git-upload-pack-request'
        }
    })
    .then(function(res) {
        if (res.headers['content-type'] != 'application/x-'+SERVICE_UPLOAD_PACK+'-advertisement') {
            throw new Error('Invalid content type when fetching pack');
        }

        return res;
    });
};

/**
 * Get a pack from the server using "git-upload-pack"
 * @param {Buffer} data
 * @return {Promise<Buffer>}
 */
HTTPTransport.prototype.uploadPack = function(data) {
    return this.request('POST', SERVICE_UPLOAD_PACK, {
        body: data,
        headers: {
            'Content-Type': 'application/x-git-upload-pack-request'
        }
    });
};

module.exports = HTTPTransport;
