/* @flow */

import RefsTransforms from './refs';
import RemotesTransforms from './remotes';

export default {
    ...RefsTransforms,
    ...RemotesTransforms
};
