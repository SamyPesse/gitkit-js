/* @flow */

import RefsTransforms from './refs';
import RemotesTransforms from './remotes';
import FilesTransforms from './files';
import WorkingTransforms from './working';

const Transforms = {
    ...RefsTransforms,
    ...RemotesTransforms,
    ...FilesTransforms,
    ...WorkingTransforms
};

export default Transforms;
