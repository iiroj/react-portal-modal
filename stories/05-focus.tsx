import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled, { StyledComponentClass } from 'styled-components';

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
      <Fragment>
        <button onClick={this.handleOpen}>Open Modal</button>
        <StyledModal
          closeOnEsc={true}
          closeOnOutsideClick={true}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          open={this.state.open}
          showClose={true}
        >
          {this.props.children}
        </StyledModal>
      </Fragment>
    );
  }
}

const Button: StyledComponentClass<any, any> = styled.button`
  display: block;

  & + & {
    margin-top: 16px;
  }
`;

storiesOf('styled-modal', module).add('Focus Lock', () => (
  <StateContainer>
    <Button>The focus is locked inside this modal</Button>
    <Button>We are trapped!</Button>
  </StateContainer>
));
