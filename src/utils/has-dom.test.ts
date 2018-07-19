import 'mocha';
import { expect } from 'chai';

import hasDom from './has-dom';

describe('hasDom: () => boolean', () => {
  let jsdom: any;

  beforeEach(() => {
    jsdom = require('jsdom-global')();
  });

  it('Returns true in browser environment', () => {
    expect(hasDom()).to.equal(true);
  });

  it('Returns false without window', () => {
    (window as any) = undefined;
    expect(hasDom()).to.equal(false);
  });

  it('Returns false without window.document', () => {
    delete (window as any).document;
    expect(hasDom()).to.equal(false);
  });

  afterEach(() => {
    jsdom();
  });
});
