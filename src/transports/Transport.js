/** @flow */

import type stream from 'stream';

class Transport {
    open(): Promise<*> {
        return Promise.resolve();
    }

    close(): Promise<*> {
        return Promise.resolve();
    }

    /*
     * Get a pack from the server using "git-upload-pack"
     */
    getWithUploadPack(resource: string): Promise<stream.Readable> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Upload a pack to the server.
     */
    postUploadPack(
        resource: string,
        content: Buffer
    ): Promise<stream.Readable> {
        return Promise.reject(new Error('Not implemented'));
    }
}

export default Transport;
