/** @flow */

/*
 * Utility for dissolve to scan for a buffer
 *
 * See https://github.com/deoxxa/dissolve/issues/21
 */
function scan(parser, name, search) {
    search = new Buffer(search, 'utf8');
    let result = new Buffer('');

    return parser.loop(function(end) {
        this.buffer('tmpSearch', 1).tap(function() {
            const c = this.vars.tmpSearch;
            result = Buffer.concat([result, c]);

            const toSearch = result.slice(-search.length);
            if (toSearch.compare(search) === 0) {
                delete this.vars.tmpSearch;
                this.vars[name] = result.slice(0, -search.length);
                end();
            }
        });
    });
}

export { scan };
