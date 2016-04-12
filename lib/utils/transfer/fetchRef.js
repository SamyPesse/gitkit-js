var Buffer = require('buffer').Buffer;

/*
    Return a buffer to send for requesting a ref

    @param {Ref}
    @param {List<Ref>}
    @return {Buffer}
*/
function refWantRequest(wantRef, haveRefs) {
    var str = '0067want ' + wantRef.getCommit() + ' multi_ack_detailed side-band-64k thin-pack ofs-delta\n0000';

    haveRefs.forEach(function(haveRef) {
        str += '0032have ' + haveRef.getCommit() + '\n';
    });
    str += '0009done\n';

    return new Buffer(str, 'utf8');
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
}

module.exports = fetchRef;
