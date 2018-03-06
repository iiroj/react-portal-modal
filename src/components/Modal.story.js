import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { css } from 'styled-components';

import Modal from './Modal';

storiesOf('portal-modal', module).add('Default stateless Modal', () => (
  <Fragment>
    <Modal>
      <p>This text is rendered in a Modal</p>
    </Modal>
  </Fragment>
));

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
        closeOnEsc={true}
        closeOnOutsideClick={true}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        open={this.state.open}
        showClose={true}
      >
        <p>This text is rendered in a Modal</p>
      </Modal>
    </Fragment>
  );
}

storiesOf('portal-modal', module).add('Stateful Modal', () => <StateContainer />);

const overlay = `
  background: yellow;
`;

const container = css`
  background-color: red;
  box-shadow: none;
  color: white;
`;

storiesOf('portal-modal', module).add('Custom styles', () => (
  <Fragment>
    <Modal style={{ container, overlay }}>
      <p>This text is rendered in a Modal</p>
    </Modal>
  </Fragment>
));
