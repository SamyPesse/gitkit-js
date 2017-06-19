/** @flow */

import path from 'path';
import mkdirp from 'mkdirp';
import { List } from 'immutable';
import GenericFS from './GenericFS';

import type { FileStat } from './GenericFS';

/*
 * Interface for a Node compatible API.
 */

class NodeFS extends GenericFS {
    fs: *;
    root: string;

    constructor(fs: *, root: string) {
        super();
        this.fs = fs;
        this.root = root;
    }

    resolve(file: string): string {
        return path.resolve(this.root, file);
    }

    /*
     * List files in a folder.
     */
    readDir(file: string): Promise<List<string>> {
        return new Promise((resolve, reject) => {
            this.fs.readdir(this.resolve(file), (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(List(files));
                }
            });
        });
    }

    /*
     * Get infos about a file.
     */
    stat(file: string): Promise<FileStat> {
        return new Promise((resolve, reject) => {
            this.fs.stat(this.resolve(file), (err, stat) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        path: file,
                        length: stat.size,
                        mode: String(stat.mode),
                        type: stat.isDirectory() ? 'dir' : 'file',
                    });
                }
            });
        });
    }

    /*
     * Read a file.
     */
    read(file: string): Promise<Buffer> {
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
    write(file: string, content: Buffer): Promise<*> {
        const filepath = this.resolve(file);
        const dirpath = path.dirname(filepath);

        return (new Promise((resolve, reject) => {
            mkdirp(dirpath, {
                fs: this.fs
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        }))
        .then(() => {
            return new Promise((resolve, reject) => {
                this.fs.writeFile(filepath, content, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    /*
     * Delete a file.
     */
    unlink(file: string): Promise<*> {
        return new Promise((resolve, reject) => {
            this.fs.unlink(this.resolve(file), err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

export default NodeFS;
