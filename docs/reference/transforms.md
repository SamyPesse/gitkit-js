# Transform

```js
import { Transform } from 'gitkit';
```

A transform allows you to define a series of changes you'd like to make to the current [`Repository`](./repository.md).

- [Properties](#properties)
  - [repo](#repo)
  - [initialRepo](#initialrepo)
- [Methods](#methods)
  - [apply](#apply)
- [Objects Transforms](#objects-transforms)
  - [`addObject`](#addobject)
  - [`addBlob`](#addblob)
  - [`addTree`](#addtree)
  - [`addCommit`](#addcommit)

## Properties

#### `repo`

A [`Repository`](./repository.md) with the transform's current operations applied. Each time you run a new transform function this property will be updated.

#### `initialRepo`

The initial state of the [`Repository`](./repository.md) when starting the transform.

## Methods

#### `apply`
`apply(): Promise<Repository>`

Applies all of the current transform steps, returning the newly transformed [`Repository`](./repository.md) once done.

## Objects Transforms

#### `addObject`
`addObject(object: GitObject): Transform`

Add a new [`GitObject`](./object.md) to the index.

#### `addBlob`
`addBlob(blob: Blob): Transform`

Add a new [`Blob`](./blob.md) to the objects index.

#### `addTree`
`addTree(tree: Tree): Transform`

Add a new [`Tree`](./tree.md) to the objects index.

#### `addCommit`
`addCommit(commit: Commit): Transform`

Add a new [`Commit`](./commit.md) to the objects index.
