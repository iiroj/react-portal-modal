import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import StyledModal from '../src';

interface IState {
  open: boolean;
}

class StateContainer extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <button onClick={this.handleOpen}>Open Modal</button>
        <StyledModal
          appId="root"
          onClose={this.handleClose}
          open={this.state.open}
        >
          {this.props.children}
        </StyledModal>
      </React.Fragment>
    );
  }
}

storiesOf('styled-modal', module).add('Stateful Modal', () => (
  <StateContainer>
    <p>This text is rendered in a Modal</p>
  </StateContainer>
));
