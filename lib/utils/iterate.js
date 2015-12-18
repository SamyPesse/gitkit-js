var _ = require('lodash');
var Q = require('q');

// Iterate over a commits tree
function forEachCommit(base, fn, opts) {
    opts = _.defaults(opts || {}, {
        limit: 100
    });

    var index = 0;

    function onCommit(commit) {
        index = index + 1;

        return commit.parse()
        .then(function() {
            fn(commit);
            if (opts.limit && index >= opts.limit) return;

            return _.reduce(commit.parents, function(prev, parent) {
                return prev.then(function() {
                    return onCommit(parent);
                });
            }, Q());
        });
    }

    return onCommit(base);
}

module.exports = {
    forEachCommit: forEachCommit
};
