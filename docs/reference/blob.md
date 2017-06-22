# Blob

```js
import { Blob } from 'gitkit';
```

A blob of content.

- [Properties](#properties)
  - [`content`](#content)
- [Methods](#methods)
  - [`toGitObject`](#togitobject)
- [Static Methods](#static-methods)
  - [`Blob.createFromBuffer`](#blobcreatefrombuffer)
  - [`Blob.createFromString`](#blobcreatefromstring)

## Properties

#### `content`

`Buffer` of the entire blob content.

## Methods

#### `toGitObject`
`toGitObject(): GitObject`

Return a [`GitObject`](./object.md) to represent this blob.

## Static Methods

#### `Blob.createFromBuffer`
`Blob.createFromBuffer(content: Buffer): Blob`

Create a blob from a raw JS buffer.

#### `Blob.createFromString`
`Blob.createFromString(content: string): Blob`

Create a blob from a plain JS string.
