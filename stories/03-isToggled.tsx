import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import StyledModal from '../src';

type ToggleDisplay = {
  isToggled: boolean;
};

const ToggleDisplay = ({ isToggled }: ToggleDisplay) => (
  <p style={{ backgroundColor: 'white', padding: '2rem' }}>
    This modal has {isToggled ? 'been' : 'not been'} toggled
  </p>
);

interface IState {
  open: boolean;
}

class StateContainer extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      open: true
    };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <React.Fragment>
        <button onClick={this.toggleOpen}>Open Modal</button>
        <StyledModal
          appId="root"
          modalComponent={ToggleDisplay}
          onClose={this.toggleOpen}
          open={this.state.open}
        />
      </React.Fragment>
    );
  }
}

storiesOf('styled-modal', module).add('Toggle state', () => <StateContainer />);
