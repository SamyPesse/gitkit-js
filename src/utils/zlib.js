/** @flow */
import pako from 'pako';
import uint8ToBuffer from 'typedarray-to-buffer';
import bufferToUint8 from 'buffer-to-uint8array';

/*
 * Decompress a gzip buffer.
 */
function unzip(buf: Buffer): Buffer {
    const input = bufferToUint8(buf);
    const output = pako.inflate(input);

    return uint8ToBuffer(output);
}

/**
 * Compress a buffer.
 */
function zip(buf: Buffer): Buffer {
    const input = bufferToUint8(buf);
    const output = pako.deflate(input);

    return uint8ToBuffer(output);
}

export default {
    zip,
    unzip
};
