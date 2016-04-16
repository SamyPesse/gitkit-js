var Buffer = require('buffer').Buffer;
var applyDelta = require('../lib/utils/transfer/applyDelta');

var DELTA = 'mwKaApA1KGQyNWNhMjVhYWJmOTkzZTg1MjdkN2I4NGFhNjMxODkxZjJlZWVmNDiRXUAFMDY5NTORokouMDY5NTMzIC0wODAwCgphZGQgYXNzZXJ0LmVuZCgpIHRvIHV0aWxzIHRlc3RzCg==';
var BASE = 'dHJlZSA0YWRlOTdjMTgxMjNjNTdhNTBlM2I5OTIzZDA1M2ZkMmRiNGY2MDVmCnBhcmVudCA3N2ZlMTg0OTRiNGI3ZWJmMGVjY2E0ZDBjY2Y4NTA3M2ZiMjFiZGZiCmF1dGhvciBDaHJpcyBEaWNraW5zb24gPGNocmlzdG9waGVyLnMuZGlja2luc29uQGdtYWlsLmNvbT4gMTM1NjY1NDMwMyAtMDgwMApjb21taXR0ZXIgQ2hyaXMgRGlja2luc29uIDxjaHJpc3RvcGhlci5zLmRpY2tpbnNvbkBnbWFpbC5jb20+IDEzNTY2NTQzMDMgLTA4MDAKCmJ1bXAgdmVyc2lvbiBmb3IgY2kudGVzdGxpbmcuY29tCg==';
var OUTPUT = 'dHJlZSA0YWRlOTdjMTgxMjNjNTdhNTBlM2I5OTIzZDA1M2ZkMmRiNGY2MDVmCnBhcmVudCBkMjVjYTI1YWFiZjk5M2U4NTI3ZDdiODRhYTYzMTg5MWYyZWVlZjQ4CmF1dGhvciBDaHJpcyBEaWNraW5zb24gPGNocmlzdG9waGVyLnMuZGlja2luc29uQGdtYWlsLmNvbT4gMTM1NjA2OTUzMyAtMDgwMApjb21taXR0ZXIgQ2hyaXMgRGlja2luc29uIDxjaHJpc3RvcGhlci5zLmRpY2tpbnNvbkBnbWFpbC5jb20+IDEzNTYwNjk1MzMgLTA4MDAKCmFkZCBhc3NlcnQuZW5kKCkgdG8gdXRpbHMgdGVzdHMK';


describe('applyDelta', function() {
    it('should correctly apply delta', function() {
        var delta = new Buffer(DELTA, 'base64');
        var base = new Buffer(BASE, 'base64');

        var out = applyDelta(base, delta);
        out.toString('base64').should.equal(OUTPUT);
    });
});
