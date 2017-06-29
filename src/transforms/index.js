/* @flow */

import ObjectsTransforms from './objects';
import RefsTransforms from './refs';
import RemotesTransforms from './remotes';
import FilesTransforms from './files';
import WorkingTransforms from './working';
import ConfigTransforms from './config';

const Transforms = {
    ...ObjectsTransforms,
    ...RefsTransforms,
    ...RemotesTransforms,
    ...FilesTransforms,
    ...WorkingTransforms,
    ...ConfigTransforms
};

export default Transforms;
