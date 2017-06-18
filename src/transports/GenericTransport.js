/** @flow */

class GenericTransport {
    open(): Promise<*> {
        return Promise.resolve();
    }

    close(): Promise<*> {
        return Promise.resolve();
    }
}

export default GenericTransport;
