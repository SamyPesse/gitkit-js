/** @flow */

/*
 * Utility for dissolve to scan for a buffer
 *
 * See https://github.com/deoxxa/dissolve/issues/21
 */
function scan(parser: *, name: string, search: string | Buffer) {
    const searchFor = new Buffer(search, 'utf8');
    let result = new Buffer('');

    return parser.loop(function(end) {
        this.buffer('tmpSearch', 1).tap(function() {
            const c = this.vars.tmpSearch;
            result = Buffer.concat([result, c]);

            const toSearch = result.slice(-searchFor.length);
            if (toSearch.compare(searchFor) === 0) {
                delete this.vars.tmpSearch;
                this.vars[name] = result.slice(0, -searchFor.length);
                end();
            }
        });
    });
}

export { scan };
