/** @flow */
/* eslint-disable no-console */

import type { Repository } from '../';

type Kwargs = {
    pretty: boolean,
    size: boolean,
    type: boolean
};

/*
 * Print an object from the database.
 */
function catFile(
    repo: Repository,
    [sha]: string[],
    { pretty, type, size }: Kwargs
): Promise<*> {
    if (!sha) {
        throw new Error('Missing argument "sha"');
    }

    return repo
        .indexObjects()
        .then(_repo => _repo.readObject(sha))
        .then(_repo => {
            const object = _repo.objects.getObject(sha);

            if (type) {
                console.log(object.type);
            } else if (size) {
                console.log(object.length);
            }
        });
}

export default {
    name: 'cat-file [sha]',
    description:
        'Provide content or type and size information for repository objects',
    exec: catFile,
    options: [
        {
            type: 'boolean',
            name: 'pretty',
            shortcut: 'p',
            description: "pretty-print object's content",
            default: false
        },
        {
            type: 'boolean',
            name: 'type',
            shortcut: 't',
            description: 'show object type',
            default: false
        },
        {
            type: 'boolean',
            name: 'size',
            shortcut: 's',
            description: 'show object size',
            default: false
        }
    ]
};
