var Git = require('../');
var mock = require('./mock');

describe('RepoUtils', function() {

    describe('.init()', function() {

        it('should initialize non-bare', function() {
            return Git.RepoUtils.init(mock.nonBare);
        });

        it('should initialize bare', function() {
            return Git.RepoUtils.init(mock.bare);
        });
    });

});

