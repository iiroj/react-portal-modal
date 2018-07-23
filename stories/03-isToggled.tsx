import React, { Component } from 'react';
import styled from 'styled-components';
import Transition from 'react-transition-group/Transition';
import { storiesOf } from '@storybook/react';

import StyledModal from '../src';

const Container = styled.div`
  ${props => props.theme.container};
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

const duration = 125;
const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0
};

const transitionStyles: any = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

const Fade = ({ children, isToggled, open }: any) => (
  <Transition
    enter={isToggled}
    in={open}
    mountOnEnter={false}
    timeout={duration}
    unmountOnExit={true}
  >
    {(state: any) => (
      <Container
        style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}
      >
        {children}
      </Container>
    )}
  </Transition>
);

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
          containerComponent={Fade}
          modalComponent={ToggleDisplay}
          onClose={this.toggleOpen}
          open={this.state.open}
        />
      </React.Fragment>
    );
  }
}

storiesOf('styled-modal', module).add('Toggle state', () => <StateContainer />);
