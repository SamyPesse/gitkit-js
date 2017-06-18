/** @flow */

import path from './path';
import GenericFS from './GenericFS';
import type { FileStat } from './GenericFS';

/*
 * Interface for a Node compatible API.
 */

class NodeFS extends GenericFS {
    fs: *;
    base: string;

    constructor(
        fs: *,
        root: string
    ) {
        super();
        this.fs = fs;
        this.root = root;
    }

    resolve(
        file: string
    ): string {
        return path.resolve(this.root, file);
    }

    /*
     * List files in a folder.
     */
    readDir(
        file: string
    ): Promise<List<string>> {

    }

    /*
     * Get infos about a file.
     */
    stat(
        file: string
    ): Promise<FileStat> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Read a file.
     */
    read(
        file: string
    ): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.fs.readFile(this.resolve(file), (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(content);
                }
            });
        });
    }

    /*
     * Write a file.
     */
    write(
        file: string,
        content: Buffer
    ): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Delete a file.
     */
    unlink(
        file: string
    ): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }
}

export default NodeFS;
