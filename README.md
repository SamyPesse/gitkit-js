# GitKit.js

[![NPM version](https://badge.fury.io/js/gitkit.svg)](http://badge.fury.io/js/gitkit)
[![Linux Build Status](https://travis-ci.org/SamyPesse/gitkit-js.svg?branch=master)](https://travis-ci.org/SamyPesse/gitkit-js)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/63nlflxcwmb2pue6?svg=true)](https://ci.appveyor.com/project/SamyPesse/gitkit-js)

GitKit is a pure JavaScript implementation of Git backed by immutable models and promises.

The goal of this project is not to be used in real-world projects, but instead to provides a readable (the code is typed using flow) JS implementation of the Git-backend with a high-level API for manipulating repositories: read files, commit changes, clone, push, etc. See [Support](#support) for details about supported operations.

This library can work both in the browser and Node.js.

## Installation

```
$ yarn add gitkit
```

## CLI

GitKit implements a CLI with the goal of being compatible with the official Git command.

⚠️ **Do not use it:** GitKit is for testing-only.

```js
$ npm install gitkit --global
$ gitkit clone https://github.com/GitbookIO/gitkit.git ./repo
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

#### Transforms

GitKit uses a transform API.

```js
repo.transform()
    .writeFile('README.md', 'Hello world')
    .addFile('README.md')
    .commit({
        message: 'Update README',
        author: Author.createFromPerson(
            Person.create({
                name: 'John Doe',
                email: 'john.doe@gmail.com'
            })
        )
    })
    .apply();
```

## Support

| Description | Status |
| --------- |:-----------:|
| Initialize a new repository | ✅ |
| **References** | |
| Listing refs (branches, tags), both from packed-refs or refs folder |  ✅ |
| Create a new reference | ❌ |
| **Branches** | |
| Read current HEAD | ✅ |
| Checkout a branch (update HEAD and working files) | ❌ |
| **Index** | |
| Listing files in the `.git/index` |  ✅ |
| Add new file in the index | ❌ |
| Update the index from the file in the repository | ❌ |
| **Trees** | |
| List all entries in a tree | ✅ |
| Create a new tree | ❌ |
| **Blobs** | |
| Read a blob by its sha | ✅ |
| Create a new blob | ❌ |
| **Commits** | |
| Read a commit by its sha | ✅ |
| Walk the commits history | ✅ |
| Create a new commit | ❌ |
| **Clone / Fetch** | |
| Discovery with the remote repository | ✅ |
| Fetch a reference | ❌ |
| Clone a new repository | ❌ |
| **Transports** | |
| HTTP / HTTPS | ✅ |
| SSH | ❌ |

## Thanks

To the people pointing me in the right directions like:

- [Stefan Saasen](http://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/)
- [Chris Dickinson](https://github.com/chrisdickinson)

## License

`GitKit.js` is [Apache-licensed](./LICENSE).
