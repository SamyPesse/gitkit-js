// @flow

var Promise = require('q');
var http = require('http');
var https = require('https');
var url = require('url');
var querystring = require('querystring');

var pkg = require('../../package.json');
var Transport = require('./base');

const SERVICE_UPLOAD_PACK = 'git-upload-pack';
// const SERVICE_RECEIVE_PACK = 'git-receive-pack';

type Auth = {
    user:     string,
    password: string
};

/**
 * HTTP/HTTPS Transport for the smart Git protocol.
 *
 * @param {String} uri
 * @param {Object<user,password>} auth
 */
class HTTPTransport extends Transport {
    uri:  string;
    auth: ?Auth;

    constructor(uri: string, auth: ?Auth) {
        super();

        this.uri = uri;
        this.auth = auth;
    }

    /**
     * Execute an HTTP request
     * @param {String} method
     * @param {String} uri
     * @param {Object<headers>} opts
     * @return {Promise<Stream>}
     */
    request(method: string, uri: string, opts: any) : Promise<stream$Readable> {
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
    }

    /**
     * Get a pack from the server using "git-upload-pack"
     * @param {String} resource
     * @return {Promise<Stream>}
     */
    getWithUploadPack(resource: string) : Promise<stream$Readable> {
        resource = resource + '?' + querystring.stringify({
            service: SERVICE_UPLOAD_PACK
        });

        return this.request('GET', resource, {
            headers: {
                'Content-Type': 'application/x-git-upload-pack-request'
            }
        })
        .then(function(res) {
            if (res.headers['content-type'] != 'application/x-' + SERVICE_UPLOAD_PACK + '-advertisement') {
                throw new Error('Invalid content type when fetching pack');
            }

            return res;
        });
    }

    /**
     * Get a pack from the server using "git-upload-pack"
     * @param {Buffer} data
     * @return {Promise<Stream>}
     */
    uploadPack(data: Buffer) : Promise<stream$Readable> {
        return this.request('POST', SERVICE_UPLOAD_PACK, {
            body: data,
            headers: {
                'Content-Type': 'application/x-git-upload-pack-request'
            }
        });
    }
}

module.exports = HTTPTransport;
