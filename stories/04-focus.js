import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

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
        closeOnEsc={true}
        closeOnOutsideClick={true}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        open={this.state.open}
        showClose={true}
      >
        {this.props.children}
      </Modal>
    </Fragment>
  );
}

const Button = styled.button`
  display: block;

  & + & {
    margin-top: 16px;
  }
`;

storiesOf('portal-modal', module).add('Focus Lock', () => (
  <StateContainer>
    <Button>The focus is locked inside this modal</Button>
    <Button>We are trapped!</Button>
  </StateContainer>
));
