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
  background-color: rgba(242, 242, 242, 0.96);
  padding: 32px 16px;
`;

const container = css`
  border-radius: 8px;
  box-shadow: 0 4px 64px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  padding: 16px;
  position: relative;
  text-align: center;
  width: 100%;
`;

storiesOf('portal-modal', module).add('Custom styles', () => (
  <Fragment>
    <Modal style={{ container, overlay }}>
      <p>This text is rendered in a Modal</p>
    </Modal>
  </Fragment>
));
