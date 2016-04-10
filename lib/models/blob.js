var Immutable = require('immutable');
var Buffer = require('buffer').Buffer;

var Blob = Immutable.Record({
    content: Buffer('')
});

/*
    Return the content as a buffer of this blob

    @return {Buffer}
*/
Blob.prototype.getContent = function() {
    return this.get('content');
};

/*
    Return the size of this blob

    @return {Number}
*/
Blob.prototype.getContentSize = function() {
    return this.getContent().length;
};

/*
    Create a blob from a Buffer

    @param {Buffer} content
    @return {Blob}
*/
Blob.createFromBuffer = function(content) {
    return new Blob({
        content: content
    });
};

/*
    Create a blob from a GitObject

    @param {GitObject} obj
    @return {Blob}
*/
Blob.createFromObject = function(obj) {
    return Blob.createFromBuffer(obj.getContent());
};

module.exports = Blob;
