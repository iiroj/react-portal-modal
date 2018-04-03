import React from 'react';
import { mount, shallow } from 'enzyme';

import Modal from '../src';

describe('Modal', () => {
  it('Should obey open=false prop', () => {
    const wrapper = mount(<Modal open={false} />);

    expect(wrapper.props().open).toEqual(false);
  });

  it('Should open when setting open=true', () => {
    const wrapper = mount(<Modal open={false} />);

    expect(wrapper.props().open).toEqual(false);

    wrapper.setProps({ open: true });

    expect(wrapper.props().open).toEqual(true);
  });

  it('Should pass props', () => {
    const wrapper = mount(<Modal foo="bar" />);
    const deepModal = wrapper.children().instance().props.children.props.children.props.children;
    expect(deepModal.props.foo).toBeDefined();
    expect(deepModal.props.foo).toEqual('bar');
  });
});
