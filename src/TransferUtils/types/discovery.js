import type {OrderedMap} from 'immutable';
import type Capabilities from './capabilities';
import type Ref from '../../models/ref';

export type Discovery = {
    capabilities: Capabilities,
    refs:         OrderedMap<string:Ref>
};
