var Q = require('q');

var parseUploadPack = require('./parseUploadPack');
var encodePktLines = require('./encodePktLines');

var GitObject = require('../../models/object');

/*
    Return a buffer to send for requesting a ref

    @param {Ref}
    @param {List<Ref>}
    @return {Buffer}
*/
function refWantRequest(wantRef, haveRefs) {
    var lines = [
        'want ' + wantRef.getCommit() + ' multi_ack_detailed side-band-64k thin-pack ofs-delta',
        ''
    ];

    haveRefs.forEach(function(haveRef) {
        lines.push('have ' + haveRef.getCommit() + '\n');
    });

    lines.push('done');

    return encodePktLines(lines);
}

/*
    Fetch a ref from the server

    @param {Repository}
    @param {Transport} transport
    @param {Ref} wantRef
    @param {List<Ref>} haveRefs
    @return {Promise}
*/
function fetchRef(repo, transport, wantRef, haveRefs) {
    var request = refWantRequest(wantRef, haveRefs);

    // Fetch the objects by calling git-upload-pack
    return transport.uploadPack(request)

    // Parse pack -> objects
    .then(parseUploadPack)

    // Write objects to the repository
    .then(function(objects) {
        throw 'done';

        return objects.reduce(function(prev, obj) {
            return prev.then(function() {
                return GitObject.writeToRepo(repo, obj);
            });
        }, Q());
    });
}

module.exports = fetchRef;
