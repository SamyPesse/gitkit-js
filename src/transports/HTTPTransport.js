/** @flow */

import querystring from 'querystring';
import url from 'url';
import http from 'http';
import https from 'https';
import type stream from 'stream';
import Transport from './Transport';
import pkg from '../../package.json';

export type HTTPAuth = {
    user: string,
    password: ?string
};

type HTTPMethod = 'GET' | 'POST';

type HTTPOptions = {
    headers: ?{ [string]: string },
    body: ?Buffer
};

const SERVICE_UPLOAD_PACK = 'git-upload-pack';

class HTTPTransport extends Transport {
    baseURL: string;
    auth: ?HTTPAuth;

    constructor(baseURL: string, auth: ?HTTPAuth) {
        super();

        this.baseURL = baseURL;
        this.auth = auth;
    }

    request(
        method: HTTPMethod,
        resource: string,
        options: HTTPOptions = {}
    ): Promise<stream.Readable> {
        return new Promise((resolve, reject) => {
            if (this.auth) {
                options.headers.Authorization = `Basic ${new Buffer(
                    `${this.auth.user}:${this.auth.password}`
                ).toString('base64')}`;
            }

            options.headers['User-Agent'] = `${pkg.name}/${pkg.version}`;

            // Parse url
            const parsed = url.parse(`${this.baseURL}/${resource}`);

            // Setup agent
            const agent = parsed.protocol == 'https:' ? https : http;

            const req = agent.request(
                {
                    method,
                    protocol: parsed.protocol,
                    hostname: parsed.hostname,
                    port: parsed.port,
                    path: parsed.path,
                    headers: options.headers
                },
                res => {
                    resolve(res);
                }
            );

            // Send request
            req.end(options.body);
        });
    }

    /*
     * Get a pack from the server using "git-upload-pack"
     */
    getWithUploadPack(baseResource: string): Promise<stream.Readable> {
        const resource = `${baseResource}?${querystring.stringify({
            service: SERVICE_UPLOAD_PACK
        })}`;

        return this.request('GET', resource, {
            headers: {
                'Content-Type': 'application/x-git-upload-pack-request'
            }
        }).then(res => {
            if (
                res.headers['content-type'] !=
                `application/x-${SERVICE_UPLOAD_PACK}-advertisement`
            ) {
                throw new Error('Invalid content type when fetching pack');
            }

            return res;
        });
    }

    /*
     * Upload a pack to the server.
     */
    postUploadPack(resource: string, body: Buffer): Promise<stream.Readable> {
        return this.request('POST', SERVICE_UPLOAD_PACK, {
            body,
            headers: {
                'Content-Type': 'application/x-git-upload-pack-request'
            }
        });
    }
}

export default HTTPTransport;
