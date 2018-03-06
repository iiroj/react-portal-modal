import React from 'react';
import { mount } from 'enzyme';

import Modal from '../src';

describe('Modal', () => {
  it('Should have sane default props', () => {
    const wrapper = mount(<Modal />);

    expect(wrapper.props().closeOnEsc).toEqual(false);
    expect(wrapper.props().closeOnOutsideClick).toEqual(false);
    expect(wrapper.props().open).toEqual(true);
    expect(wrapper.props().style).toEqual({});
    expect(wrapper.state('open')).toEqual(true);
  });

  it('Should obey open=false prop', () => {
    const wrapper = mount(<Modal open={false} />);

    expect(wrapper.props().open).toEqual(false);
    expect(wrapper.state('open')).toEqual(false);
  });

  it('Should open when setting open=true', () => {
    const wrapper = mount(<Modal open={false} />);

    expect(wrapper.props().open).toEqual(false);
    expect(wrapper.state('open')).toEqual(false);

    wrapper.setProps({ open: true });

    expect(wrapper.props().open).toEqual(true);
    expect(wrapper.state('open')).toEqual(true);
  });
});
