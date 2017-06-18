/** @flow */

import fs from 'fs';
import NodeFS from './NodeFS';

/*
 * FS when running GitKit in node.js.
 */

class NativeFS extends NodeFS {
    constructor(root: string) {
        super(fs, root);
    }
}

export default NativeFS;
