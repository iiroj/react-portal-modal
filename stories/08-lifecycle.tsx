import * as React from "react";
import styled from "styled-components";
import Transition from "react-transition-group/Transition";
import { storiesOf } from "@storybook/react";

import StyledModal, { ContainerProps } from "../src";

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

const Fade = ({ children, isToggled, open, theme }: ContainerProps) => (
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
          ...theme.container,
          ...defaultStyle,
          ...transitionStyles[state]
        }}
      >
        {children}
      </Container>
    )}
  </Transition>
);

const ToggleDisplay = React.forwardRef((_props, ref) => (
  <p
    ref={ref as React.RefObject<HTMLParagraphElement>}
    style={{ backgroundColor: "white", padding: "2rem" }}
  >
    This text is in a modal
  </p>
));

interface IState {
  open: boolean;
}

class StateContainer extends React.Component<{}, IState> {
  state = {
    open: true
  };

  beforeOpen = async () => {
    console.log("beforeOpen: start");
    await timeout(1000);
    console.log("beforeOpen: finish");
  };

  onOpen = () => this.setState({ open: true });

  afterOpen = async () => {
    console.log("afterOpen: start");
    await timeout(1000);
    console.log("afterOpen: finish");
  };

  beforeClose = async () => {
    console.log("beforeClose: start");
    await timeout(1000);
    console.log("beforeClose: finish");
  };

  onClose = () => this.setState({ open: false });

  afterClose = async () => {
    console.log("afterClose: start");
    await timeout(1000);
    console.log("afterClose: finish");
  };

  render() {
    return (
      <>
        <h1>Lifecycle events are logged to console</h1>
        <button onClick={this.onOpen}>Open Modal</button>
        <StyledModal
          afterClose={this.afterClose}
          afterOpen={this.afterOpen}
          appId="root"
          beforeClose={this.beforeClose}
          beforeOpen={this.beforeOpen}
          containerComponent={Fade}
          modalComponent={ToggleDisplay}
          onClose={this.onClose}
          onOpen={this.onOpen}
          open={this.state.open}
        />
      </>
    );
  }
}

storiesOf("styled-modal", module).add("Lifecycle methods", () => (
  <StateContainer />
));
