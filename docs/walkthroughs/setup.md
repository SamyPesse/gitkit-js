# Setup

GitKit is an npm module, so to install it you do:

```
npm install gitkit
```

GitKit exposes a set of modules that you'll use to work with Git. The most important of which is an [`Repository`](../reference/repository.md) model.

GitKit is FS-agnostic, it means that it can work on the browser and in a native environment.

We'll first by using GitKit in a node.js environment:

```js
import { Repository } from 'gitkit';
import NativeFS from 'gitkit/lib/fs/native';

// Create a filesystem to access the repository on the disk:
const fs = new NativeFS(process.cwd());

// Create a repository:
const repo = new Repository({ fs });
```
