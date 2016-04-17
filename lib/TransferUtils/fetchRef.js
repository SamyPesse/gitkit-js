var Q = require('q');

var parseUploadPack = require('./parseUploadPack');
var encodePktLines = require('./encodePktLines');
var RepoUtils = require('../RepoUtils');
var ProgressLine = require('../models/progressLine');

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

    .then(function(res) {
        var d = Q.defer();
        var countObjects = 0;
        var objectIndex = 0;

        res
        .pipe(parseUploadPack({
            onCount: function(count) {
                countObjects = count;
            }
        }))

        .pipe(
            RepoUtils.writeObjectStream(repo)
            .on('data', function() {
                objectIndex++;

                d.notify(ProgressLine.FetchObject(objectIndex, countObjects));
            })
        )

        .on('error', function(err) {
            d.reject(err);
        })
        .on('finish', function() {
            d.resolve();
        });


        return d.promise;
    });
}

module.exports = fetchRef;
