/** @flow */

import type Dissolve from 'dissolve';

/*
 * Utility for dissolve to scan for a buffer
 *
 * See https://github.com/deoxxa/dissolve/issues/21
 */
function scan(
    parser: Dissolve,
    name: string,
    search: string | Buffer
): Dissolve {
    const searchFor = new Buffer(search, 'utf8');
    let result = new Buffer('');

    return parser.loop(end => {
        parser.buffer('tmpSearch', 1).tap(() => {
            const c = parser.vars.tmpSearch;
            result = Buffer.concat([result, c]);

            const toSearch = result.slice(-searchFor.length);
            if (toSearch.compare(searchFor) === 0) {
                delete parser.vars.tmpSearch;
                parser.vars[name] = result.slice(0, -searchFor.length);
                end();
            }
        });
    });
}

export { scan };
