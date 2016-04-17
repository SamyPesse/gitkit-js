var Git = require('../');
var fixtures = require('./fixtures');

describe('WorkingIndex', function() {

    it('.createFromBuffer', function() {
        var buf = fixtures.read('index');
        var wk = Git.WorkingIndex.createFromBuffer(buf);

        var version = wk.getVersion();
        var entries = wk.getEntries();

        version.should.equal(2);
        entries.size.should.equal(94);
    });

});
