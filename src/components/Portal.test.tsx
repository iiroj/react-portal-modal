import 'mocha';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import React from 'react';

import Portal, { flushPortals, collectPortals } from './Portal';

describe('<Portal />', () => {
  let jsdom: any;
  let portal: any;

  it('Renders to and creates div#modal by default', () => {
    jsdom = require('jsdom-global')();
    expect(document.body.childElementCount).to.equal(0);

    portal = mount(<Portal>test</Portal>);
    const modalContainer = document.getElementById('modal')!;

    expect(modalContainer.innerHTML).to.equal('test');
    expect(document.body.childElementCount).to.equal(1);
  });

  it('Renders to pre-existing div#modal by default', () => {
    jsdom = require('jsdom-global')('<html><body><div id="modal">');
    expect(document.body.childElementCount).to.equal(1);

    portal = mount(<Portal>test</Portal>);
    const modalContainer = document.getElementById('modal')!;

    expect(modalContainer.innerHTML).to.equal('test');
    expect(document.body.childElementCount).to.equal(1);
  });

  it('Renders to and creates div with supplied id', () => {
    jsdom = require('jsdom-global')('<html><body><div id="foo">');
    expect(document.body.childElementCount).to.equal(1);

    portal = mount(<Portal target="bar">test</Portal>);
    const modalContainer = document.getElementById('bar')!;

    expect(modalContainer.innerHTML).to.equal('test');
    expect(document.body.childElementCount).to.equal(2);

    const otherContainer = document.getElementById('foo')!;
    expect(otherContainer.innerHTML).to.equal('');
  });

  it('Renders to pre-existing div with supplied id', () => {
    jsdom = require('jsdom-global')('<html><body><div id="foo"></div><div id="bar">');
    expect(document.body.childElementCount).to.equal(2);

    portal = mount(<Portal target="foo">test</Portal>);
    const modalContainer = document.getElementById('foo')!;

    expect(modalContainer.innerHTML).to.equal('test');
    expect(document.body.childElementCount).to.equal(2);

    const otherContainer = document.getElementById('bar')!;
    expect(otherContainer.innerHTML).to.equal('');
  });

  afterEach(() => {
    portal.unmount();
    jsdom();
  });
});

describe('flushPortals: (id: string) => void', () => {
  let jsdom: any;

  it('Removes all children from the supplied target', () => {
    jsdom = require('jsdom-global')('<html><body><div id="modal"><div id="foo"></div><div id="bar"></div></div>');

    const modalContainer = document.getElementById('modal')!;
    expect(modalContainer.childElementCount).to.equal(2);

    flushPortals('modal');

    expect(modalContainer.childElementCount).to.equal(0);
    expect(modalContainer.innerHTML).to.equal('');
  });

  after(() => {
    jsdom();
  });
});

describe('collectPortals: () => HTMLElement[]', () => {
  let portal: any;

  it('Returns all elements from the global array', () => {
    portal = shallow(<Portal>test</Portal>);

    const collectedPortals = collectPortals();

    expect(collectedPortals)
      .to.be.an('array')
      .that.has.lengthOf(1)
      .which.contains('test');
  });

  it('Clears elements after returning them', () => {
    portal = shallow(<Portal>foo</Portal>);

    const collectedPortals = collectPortals();

    expect(collectedPortals)
      .to.be.an('array')
      .that.has.lengthOf(1)
      .which.contains('foo');

    portal = shallow(<Portal>bar</Portal>);

    const collectedPortals2 = collectPortals();

    expect(collectedPortals2)
      .to.be.an('array')
      .that.has.lengthOf(1)
      .which.contains('bar');
  });
});
