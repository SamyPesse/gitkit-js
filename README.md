# GitKit.js

[![NPM version](https://badge.fury.io/js/gitkit.svg)](http://badge.fury.io/js/gitkit)
[![Linux Build Status](https://travis-ci.org/SamyPesse/gitkit-js.svg?branch=master)](https://travis-ci.org/SamyPesse/gitkit-js)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/63nlflxcwmb2pue6?svg=true)](https://ci.appveyor.com/project/SamyPesse/gitkit-js)

GitKit is a pure JavaScript implementation of Git backed by immutable models and promises.

The goal of this project is not to be used in real-world projects, but instead to provides a readable (the code is typed using flow) JS implementation of the Git-backend with a high-level API for manipulating repositories: read files, commit changes, clone, push, etc.

This library can work both in the browser and Node.js.

## Installation

```
$ yarn add gitkit
```

## Usage

State of the Git repository is represented as a single immutable `Repository` instance. Read and write access to the repository is done using a `FS` driver, the implementation of the fs depends on the platform (`NativeFS` for Node.js, `LocalStorageFS` or `MemoryFS` for the browser).

```js
import { Repository } from 'gitkit';

import NativeFS from 'gitkit/lib/fs/native';

// Create a filesystem to access the repository on the disk:
const fs = new NativeFS(process.cwd());

// Create a repository:
const repo = new Repository({ fs });
```

## Thanks

To the people pointing me in the right directions like:

- [Stefan Saasen](http://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/)
- [Chris Dickinson](https://github.com/chrisdickinson)

## License

`GitKit.js` is [Apache-licensed](./LICENSE).
