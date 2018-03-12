import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import Modal from '../src';

class StateContainer extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render = () => (
    <Fragment>
      <button onClick={this.handleOpen}>Open Modal</button>
      <Modal
        appId="root"
        closeOnEsc={true}
        closeOnOutsideClick={true}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        open={this.state.open}
      >
        {this.props.children}
      </Modal>
    </Fragment>
  );
}

storiesOf('portal-modal', module).add('Stateful Modal', () => (
  <StateContainer>
    <p>This text is rendered in a Modal</p>
  </StateContainer>
));
