# gitkit

Pure JavaScript implementation of Git backed by immutable models and promises.

The goal is to provide both a low and high level API for manipulating Git repositories: read files, commit changes, edit working index, clone, push, fetch, etc.

## Installation

```
$ npm install gitkit
```

## Usage

#### API

```js
var Git = require('git-js');
var NodeFS = require('git-js/lib/fs/node');

// Prepare the filesystem
var fs = NodeFS(process.cwd());

// Create a repository instance
var repo = Repository.createWithFS(fs, isBare);
```

#### Examples

| Example | Description |
| ------- | ----------- |
| [Clone](./examples/clone.js) | Clone a remote git repository |


## Thanks

To the people pointing me in the right directions like:

- [Stefan Saasen](http://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/)
- [Chris Dickinson](https://github.com/chrisdickinson)

## License

`GitKit.js` is [Apache-licensed](./LICENSE.md).
