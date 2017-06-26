/** @flow */

import Dissolve from 'dissolve';
import through from 'through2';
import { Record, OrderedMap, List } from 'immutable';
import Ref from './Ref';

import type { Transport } from '../transports';

const LINEMETA_TYPES = {
    FLUSH: 'pkt-flush',
    LINE: 'pkt-line',
    PACKFILE: 'packfile',
    PROGRESS: 'progress',
    ERROR: 'error'
};

/*
 * Model to represent the discovery between the server
 * and the client during a fetch/clone.
 *
 * Parses the response to /info/refs?service=git-upload-pack, which contains ids for
 * refs/heads and a capability listing for this git HTTP server.
 */

const DEFAULTS: {
    refs: OrderedMap<string, Ref>,
    capabilities: List<string>
} = {
    refs: new OrderedMap(),
    capabilities: List()
};

class FetchDiscovery extends Record(DEFAULTS) {
    /*
     * Fetch discovery from the server using a transport.
     */
    static fetch(transport: Transport): Promise<FetchDiscovery> {
        return transport.getWithUploadPack('info/refs').then(
            res =>
                new Promise((resolve, reject) => {
                    let capabilities;
                    let lineIndex = 0;
                    let refs = new OrderedMap();

                    res
                        .pipe(createPKTLinesParser())
                        .pipe(createPKTLinesMetaParser())
                        .on('data', line => {
                            lineIndex += 1;

                            if (line.caps && !capabilities) {
                                capabilities = line.caps;
                            }

                            if (
                                lineIndex === 1 ||
                                line.type !== LINEMETA_TYPES.LINE
                            ) {
                                return;
                            }

                            const content = line.toString('utf8').trim();
                            const parts = content.split(' ');

                            const refName = parts[1];
                            const sha = parts[0];
                            const ref = new Ref({ commit: sha });

                            refs = refs.set(refName, ref);
                        })
                        .on('error', err => {
                            reject(err);
                        })
                        .on('end', () => {
                            resolve(
                                new FetchDiscovery({
                                    refs,
                                    capabilities: List(capabilities)
                                })
                            );
                        });
                })
        );
    }
}

/*
 * Create a parser for pkt lines.
 */
function createPKTLinesParser(): Dissolve {
    const parser = Dissolve();

    parser.loop(end => {
        parser.buffer('lineLength', 4).tap(() => {
            const lineLength = parseInt(parser.vars.lineLength.toString(), 16);

            if (lineLength === 0) {
                parser.push(new Buffer(''));
                return;
            }

            parser.buffer('line', lineLength - 4).tap(() => {
                parser.push(parser.vars.line);
            });
        });
    });

    return parser;
}

/*
 * Create a a parser for line metadatas
 */
function createPKTLinesMetaParser(isServer: boolean = false): Dissolve {
    let caps = null;
    let lineIndex = 0;

    const divineCapabilities = isServer
        ? divineServerCapabilities
        : divineClientCapabilities;

    // On which line shuld we look for capabilities?
    const checkCapsOn = isServer ? 1 : 0;

    return through.obj((line, enc, callback) => {
        let resultType;
        let result = line;

        // Detect type
        if (line.length === 0) {
            resultType = LINEMETA_TYPES.FLUSH;
        } else {
            const peek = line[0];

            if (peek == 1) {
                resultType = LINEMETA_TYPES.PACKFILE;
            } else if (peek == 2) {
                resultType = LINEMETA_TYPES.PROGRESS;
            } else if (peek == 3) {
                resultType = LINEMETA_TYPES.ERROR;
            } else {
                resultType = LINEMETA_TYPES.LINE;
            }
        }

        // Should we look for capabilities
        if (!caps && lineIndex === checkCapsOn) {
            caps = divineCapabilities(result);
            if (caps) {
                result = result.slice(0, caps.idx + 1);
                result[result.length - 1] = 0x0a;
                caps = caps.caps;
            }
        }

        // Remove first byte to define type
        if (resultType !== LINEMETA_TYPES.LINE) {
            result = result.slice(1);
        }

        result.type = resultType;
        result.caps = caps;

        lineIndex += 1;

        if (resultType === LINEMETA_TYPES.FLUSH) {
            lineIndex = 0;
            caps = null;
        } else if (
            resultType === LINEMETA_TYPES.PROGRESS ||
            resultType === LINEMETA_TYPES.ERROR
        ) {
            this.emit(resultType, result);
        }

        callback(null, result);
    });
}

function divineClientCapabilities(buf) {
    let i;
    let len;

    for (i = 0, len = buf.length; i < len; i += 1) {
        if (buf[i] === 0) {
            break;
        }
    }

    if (i === len) {
        return null;
    }

    return {
        idx: i,
        caps: buf.slice(i + 1, buf.length - 1).toString('utf8').split(' ')
    };
}

function divineServerCapabilities(buf) {
    let i;
    let len;
    const isFetch = buf.slice(0, 4).toString() === 'want';

    if (isFetch) {
        for (i = 45, len = buf.length; i < len; i += 1) {
            if (buf[i] === 32) {
                break;
            }
        }
    } else {
        for (i = 0, len = buf.length; i < len; i += 1) {
            if (buf[i] === 0) {
                break;
            }
        }
    }

    if (i === len) {
        return null;
    }

    return {
        idx: i,
        caps: buf.slice(i + 1, buf.length - 1).toString('utf8').split(' ')
    };
}

export default FetchDiscovery;
