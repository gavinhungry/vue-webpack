import 'jsdom-global/register';

import { mount } from '@vue/test-utils';
import { expect } from 'chai';

global.mount = mount;
global.expect = expect;
