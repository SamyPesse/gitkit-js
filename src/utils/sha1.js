/** @flow */

const crypto = require('crypto');

const sha1 = {
    is: validateSha,
    encode
};

/*
 * Validates a SHA in hexadecimal.
 */
function validateSha(str: string): boolean {
    return /[0-9a-f]{40}/.test(str);
}

/*
 * Encode content as sha.
 */
function encode(s: Buffer): string {
    const shasum = crypto.createHash('sha1');
    shasum.update(s);
    return shasum.digest('hex');
}

export default sha1;
