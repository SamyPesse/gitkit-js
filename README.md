# git.js

Pure JavaScript implementation of Git backed by immutable models.

### Installation

```
$ npm install <name>
```

### Command line Usage

```
# List commits on the current branch
$ gitjs log

# List entries in a tree
$ gitjs ls-tree [sha]

# Print an object (blob / tree / commit)
$ gitjs cat-file [sha]

# List all files in working directory
$ gitjs ls-files
```

### Usage

##### Track a file

Add a file to the working index:

```js
git.WorkingUtils.add(repo, 'README.md')
    .then(function() {
        ...
    });
```

