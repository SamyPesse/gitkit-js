/** @flow */

import path from 'path';
import { Record } from 'immutable';
import GenericFS from '../fs/GenericFS';

import Config from './Config';
import WorkingIndex from './WorkingIndex';
import ObjectsIndex from './ObjectsIndex';
import RefsIndex from './RefsIndex';
import Head from './Head';
import type { SHA } from '../types/SHA';

const DEFAULTS: {
    isBare: boolean,
    fs: GenericFS,
    // The .git/config
    config: Config,
    // Head reference
    head: Head,
    // Index of working files (only for non-bare repos)
    workingIndex: WorkingIndex,
    // Index to read/edit git objects
    objects: ObjectsIndex,
    // Index to read/edit references
    refs: RefsIndex
} = {
    isBare: false,
    fs: new GenericFS(),
    config: new Config(),
    head: new Head(),
    workingIndex: new WorkingIndex(),
    objects: new ObjectsIndex(),
    refs: new RefsIndex()
};

class Repository extends Record(DEFAULTS) {
    /*
     * Return sha of head commit.
     */
    get headCommit(): SHA {
        const { head, refs } = this;

        if (!head.commit && !head.ref) {
            throw new Error('Invalid HEAD');
        }

        if (head.isDetached) {
            return head.commit;
        }

        const ref = refs.getRef(head.ref);

        if (!ref) {
            throw new Error(`Ref from HEAD "${head.ref}" not found`);
        }

        return ref.commit;
    }

    /*
     * Resolve a file from the .git folder.
     */
    resolveGitFile(file: string): string {
        const { isBare } = this;
        return isBare ? file : path.join('.git', file);
    }

    /*
     * Read a Git object by its sha.
     */
    readObject(sha: SHA): Promise<Repository> {
        return this.objects.readObject(this, sha).then(objects =>
            this.merge({
                objects
            })
        );
    }

    /*
     * Read the HEAD.
     */
    readHEAD(): Promise<Repository> {
        return Head.readFromRepository(this).then(head => this.merge({ head }));
    }

    /*
     * Read the config.
     */
    readConfig(): Promise<Repository> {
        return Config.readFromRepository(this).then(config =>
            this.merge({ config })
        );
    }

    /*
     * Read the working index.
     */
    readWorkingIndex(): Promise<Repository> {
        return WorkingIndex.readFromRepository(this).then(workingIndex =>
            this.merge({ workingIndex })
        );
    }

    /*
     * Index all refs.
     */
    indexRefs(): Promise<Repository> {
        return RefsIndex.indexFromRepository(this).then(refs =>
            this.merge({ refs })
        );
    }

    /*
     * Index all objects
     */
    indexObjects(): Promise<Repository> {
        return ObjectsIndex.indexFromRepository(this).then(objects =>
            this.merge({ objects })
        );
    }
}

export default Repository;
