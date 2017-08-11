/** @flow */

import { Record } from 'immutable';
import Concentrate from 'concentrate';
import Dissolve from 'dissolve';

import type { FileStat } from '../fs/GenericFS';
import { htonl } from '../utils/buffer';

/*
 * Model to represent an entry in the git index.
 *
 * https://github.com/git/git/blob/master/Documentation/technical/index-format.txt
 */

const DEFAULTS: {
    ctime: Date,
    mtime: Date,
    dev: number,
    ino: number,
    mode: number,
    uid: number,
    gid: number,
    fileSize: number,
    flags: number,
    extendedFlags: number,
    sha: string,
    path: string
} = {
    ctime: new Date(),
    mtime: new Date(),
    dev: 0,
    ino: 0,
    mode: 0,
    uid: 0,
    gid: 0,
    fileSize: 0,
    flags: 0,
    extendedFlags: 0,
    sha: '',
    path: ''
};

class IndexEntry extends Record(DEFAULTS) {
    /*
     * Convert this index entry to a buffer that can be written to
     * the working index.
     */
    toBuffer(version: number = 3): Buffer {
        let output = Concentrate()
            // ctime
            .uint32be(this.ctime.getTime() / 1000)
            .uint32be(0)
            // mtime
            .uint32be(this.mtime.getTime() / 1000)
            .uint32be(0)
            .buffer(htonl(this.dev))
            .buffer(htonl(this.ino))
            .uint32be(this.mode)
            .buffer(htonl(this.uid))
            .buffer(htonl(this.gid))
            .buffer(htonl(this.fileSize))
            .string(new Buffer(this.sha).toString('hex'))
            .uint16be(this.flags);

        if (version >= 3) {
            output = output.uint16be(this.extendedFlags);
        }

        output = output.string(this.path);

        const buf = output.result();
        const padlen = 8 - buf.length % 8 || 8;

        return Buffer.concat([buf, Buffer.alloc(padlen, 0)]);
    }

    /*
     * Create a parser to parse an index entry.
     * It emits the event "entry" and set the vars; entry.
     */
    static createParser(
        version: number,
        parser: Dissolve = Dissolve()
    ): Dissolve {
        const baseOffset = parser.offset;

        parser
            .uint32be('ctime')
            .uint32be('ctime_nano')
            .uint32be('mtime')
            .uint32be('mtime_nano')
            .uint32be('dev')
            .uint32be('ino')
            .uint32be('mode')
            .uint32be('uid')
            .uint32be('gid')
            .uint32be('fileSize')
            .buffer('sha', 20)
            .uint8('flags')
            .uint8('pathLength')
            .tap(() => {
                if (version < 3) {
                    return;
                }

                parser.uint16be('extendedFlags');
            })
            // Read path
            .tap(() => {
                parser.string('path', parser.vars.pathLength);
            })
            .tap(() => {
                const { offset } = parser;
                const relativeOffset = offset - baseOffset;
                const padlen = 8 - relativeOffset % 8 || 8;
                parser.skip(padlen);
            })
            .tap(() => {
                const entry = new IndexEntry({
                    ctime: new Date(parser.vars.ctime * 1000),
                    mtime: new Date(parser.vars.mtime * 1000),
                    sha: parser.vars.sha.toString('hex'),
                    path: parser.vars.path,
                    dev: parser.vars.dev,
                    ino: parser.vars.ino,
                    fileSize: parser.vars.fileSize,
                    uid: parser.vars.uid,
                    gid: parser.vars.gid,
                    flags: parser.vars.flags,
                    extendedFlags: parser.vars.extendedFlags || 0
                });

                parser.vars.entry = entry;
                parser.emit('entry', entry);
            });

        return parser;
    }

    /*
     * Create an index entry from the stat result of a file.
     */
    static createFromFileStat(stat: FileStat, sha: string): IndexEntry {
        return new IndexEntry({
            sha,
            mode: stat.mode,
            fileSize: stat.size,
            path: stat.path,
            ctime: stat.ctime,
            mtime: stat.mtime,
            dev: stat.dev,
            ino: stat.ino,
            uid: stat.uid,
            gid: stat.gid,
            flags: 0,
            extendedFlags: 0
        });
    }
}

export default IndexEntry;
