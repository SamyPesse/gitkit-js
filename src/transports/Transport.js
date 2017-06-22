/** @flow */

class Transport {
    open(): Promise<*> {
        return Promise.resolve();
    }

    close(): Promise<*> {
        return Promise.resolve();
    }
}

export default Transport;
