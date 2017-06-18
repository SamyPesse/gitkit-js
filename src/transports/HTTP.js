/** @flow */

import GenericTransport from './GenericTransport';

export type HTTPAuth = {
    user: string,
    password: ?string,
};

class HTTP extends GenericTransport {
    url: string;
    auth: ?HTTPAuth;

    constructor(url: string, auth: ?HTTPAuth) {
        super();

        this.url = url;
        this.auth = auth;
    }
}

export default HTTP;
