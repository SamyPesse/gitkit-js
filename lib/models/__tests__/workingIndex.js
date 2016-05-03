var WorkingIndex = require('../workingIndex');

describe('WorkingIndex', function() {
    it('.createFromBuffer', function() {
        var buf = fixtures.read('index');
        var wk = WorkingIndex.createFromBuffer(buf);

        var version = wk.getVersion();
        var entries = wk.getEntries();

        expect(version).toBe(2);
        expect(entries.size).toBe(94);
    });
});
