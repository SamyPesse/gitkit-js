/** @flow */

import path from 'path';
import { OrderedMap } from 'immutable';
import type { List } from 'immutable';

export type FileType = 'file' | 'dir';

export type FileStat = {
    path: string,
    size: number,
    mode: string,
    type: FileType,
    ctime: Date,
    mtime: Date,
    dev: number,
    ino: number,
    uid: number,
    gid: number
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
     * Read the entire file.
     */
    read(filepath: string): Promise<Buffer> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Read specific position of a file.
     * The basic implementation is to read the entire buffer and slice it.
     * Custom FS can implement an optimized version.
     */
    readAt(filepath: string, offset: number, length: number): Promise<Buffer> {
        return this.read(filepath).then(buffer =>
            buffer.slice(offset, offset + length)
        );
    }

    /*
     * Write a file.
     */
    write(filepath: string, content: Buffer): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Create a directory.
     */
    mkdir(dirpath: string): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Delete a file.
     */
    unlink(filepath: string): Promise<*> {
        return Promise.reject(new Error('Not implemented'));
    }

    /*
     * Check if a file exists
     */
    exists(file: string): Promise<boolean> {
        return this.stat(file).then(() => true, err => Promise.resolve(false));
    }

    /*
     * List all files in a tree.
     */
    readTree(
        dirpath: string = '',
        {
            prefix = dirpath
        }: {
            prefix?: string
        } = {}
    ): Promise<OrderedMap<string, FileStat>> {
        return this.readDir(dirpath).then(files =>
            files.reduce(
                (prev, file) =>
                    prev.then((accu: OrderedMap<string, FileStat>) => {
                        const filepath = path.join(dirpath, file);

                        return this.stat(filepath).then(stat => {
                            if (stat.type == 'dir') {
                                return this.readTree(filepath, {
                                    prefix
                                }).then(out => accu.merge(out));
                            }

                            return accu.set(
                                path.relative(prefix, filepath),
                                stat
                            );
                        });
                    }),
                Promise.resolve(new OrderedMap())
            )
        );
    }
}

export default GenericFS;
