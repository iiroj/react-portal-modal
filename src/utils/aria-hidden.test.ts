import 'mocha';
import { expect } from 'chai';

import setAriaHidden from './aria-hidden';

describe('setAriaHidden: { on: (id: string) => void, off: (id: string => void) }', () => {
  let jsdom: any;
  let root: any;

  before(() => {
    jsdom = require('jsdom-global')();
    root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  it('Sets the attribute aria-hidden on/off for specified dom element', () => {
    expect(root.getAttribute('aria-hidden')).to.equal(null);

    setAriaHidden.on('root');
    expect(root.getAttribute('aria-hidden')).to.equal('true');

    setAriaHidden.off('root');
    expect(root.getAttribute('aria-hidden')).to.equal(null);
  });

  after(() => {
    jsdom();
  });
});
