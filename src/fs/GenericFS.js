/** @flow */

import type { List } from 'immutable';

export type FileType = 'file' | 'dir';

export type FileStat = {
    path: string,
    length: number,
    mode: string,
    type: FileType,
};

class GenericFS {

    /*
     * List files in a folder.
     */
    readDir(path: string): Promise<List<string>> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Get infos about a file.
     */
    stat(path: string): Promise<FileStat> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Read a file.
     */
    read(path: string): Promise<Buffer> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Write a file.
     */
    write(path: string, content: Buffer): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Delete a file.
     */
    unlink(path: string): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }
}

export default GenericFS;
