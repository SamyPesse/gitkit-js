/** @flow */

import path from 'path';
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
    readDir(dirpath: string): Promise<List<string>> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Get infos about a file.
     */
    stat(filepath: string): Promise<FileStat> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Read a file.
     */
    read(filepath: string): Promise<Buffer> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Write a file.
     */
    write(filepath: string, content: Buffer): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Delete a file.
     */
    unlink(filepath: string): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * List all files in a tree.
     */
    readTree(dirpath: string = ''): OrderedMap<string,FileStat> {
        return this.readDir(dirpath)
        .then(files => {

            return files.reduce(
                (prev, file) => {
                    return prev.then((accu) => {
                        const filepath = path.join(dirpath, file);

                        return this.stat(filepath)
                        .then(stat => {
                            if (stat.type == 'dir') {
                                return this.readTree(filepath)
                                .then(out => accu.merge(out))
                            }

                            return accu.set(filepath, stat);
                        })
                    });
                },
                Promise.resolve(new OrderedMap())
            );
        });
    }
}

export default GenericFS;
