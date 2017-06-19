/** @flow */

import MemoryFileSystem from 'memory-fs';
import NodeFS from './NodeFS';

/*
 * Filesystem stored in memory.
 */

class MemoryFS extends NodeFS {
    constructor() {
        super(new MemoryFileSystem(), '/');
    }
}

export default MemoryFS;
