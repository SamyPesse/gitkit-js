# Commit Changes

Once we've [setup our repository](./setup.md), we can now commit changes to it.

A commit requires infos about our identity:

```js
import { Person, Author } from 'gitkit';

const john = new Person({
    name: 'John Doe',
    email: 'john@doe.com'
});

```


Series of changes are describe by a [`Transform`](../reference/transform.md).

```js
repo.transform()
    // Update the file on the disk
    .writeFile('README.md', 'Hello world')
    // Add the file to the working index to signal that we want to commit it.
    .addFile('README.md')
    // Commit change.
```
