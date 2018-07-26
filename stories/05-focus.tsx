import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled, { StyledComponentClass } from 'styled-components';

import StyledModal from '../src';

interface IState {
  open: boolean;
}

class StateContainer extends Component<{}, IState> {
  state = {
    open: false
  };

  toggleOpen = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <>
        <h1>Modal can auto-focus inside when opening</h1>
        <button onClick={this.toggleOpen}>Open Modal</button>
        <StyledModal
          closeOnEsc={true}
          closeOnOutsideClick={true}
          onClose={this.toggleOpen}
          open={this.state.open}
        >
          {this.props.children}
        </StyledModal>
      </>
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
