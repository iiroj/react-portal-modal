import * as React from 'react';
import { storiesOf } from '@storybook/react';

import StyledModal from '../src';

interface IState {
  open: boolean;
}

class StateContainer extends React.Component<{}, IState> {
  state = {
    open: false
  };

  toggleOpen = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <React.Fragment>
        <button onClick={this.toggleOpen}>Open Modal</button>
        <StyledModal appId="root" onClose={this.toggleOpen} open={this.state.open}>
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
