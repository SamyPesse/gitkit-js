/* @flow */

import RefsTransforms from './refs';
import RemotesTransforms from './remotes';
import FilesTransforms from './files';

const Transforms = {
    ...RefsTransforms,
    ...RemotesTransforms,
    ...FilesTransforms
};

export default Transforms;
