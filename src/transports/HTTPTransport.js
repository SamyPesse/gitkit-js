/** @flow */

import Transport from './Transport';

export type HTTPAuth = {
    user: string,
    password: ?string
};

class HTTPTransport extends Transport {
    url: string;
    auth: ?HTTPAuth;

    constructor(url: string, auth: ?HTTPAuth) {
        super();

        this.url = url;
        this.auth = auth;
    }
}

export default HTTPTransport;
