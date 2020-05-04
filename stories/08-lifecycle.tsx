import * as React from "react";
import styled from "styled-components";
import Transition from "react-transition-group/Transition";
import { storiesOf } from "@storybook/react";

import StyledModal, { ContainerProps } from "../src";

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const Container = styled.div`
  ${(props) => props.theme.container};
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

const duration = 125;
const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: { [key: string]: object } = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

const Fade = ({ children, isToggled, open, theme }: ContainerProps) => (
  <Transition
    enter={isToggled}
    in={open}
    mountOnEnter={false}
    timeout={duration}
    unmountOnExit={true}
  >
    {(state) => (
      <Container
        style={{
          ...theme.container,
          ...defaultStyle,
          ...transitionStyles[state],
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

const LifeCycle = () => {
  const [open, setOpen] = React.useState(true);

  const handleBeforeOpen = async () => {
    console.log("beforeOpen: start");
    await timeout(1000);
    console.log("beforeOpen: finish");
  };

  const handleAfterOpen = async () => {
    console.log("afterOpen: start");
    await timeout(1000);
    console.log("afterOpen: finish");
  };

  const handleBeforeClose = async () => {
    console.log("beforeClose: start");
    await timeout(1000);
    console.log("beforeClose: finish");
  };

  const handleAfterClose = async () => {
    console.log("afterClose: start");
    await timeout(1000);
    console.log("afterClose: finish");
  };

  return (
    <>
      <h1>Lifecycle events are logged to console</h1>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <StyledModal
        afterClose={handleAfterClose}
        afterOpen={handleAfterOpen}
        appId="root"
        beforeClose={handleBeforeClose}
        beforeOpen={handleBeforeOpen}
        containerComponent={Fade}
        modalComponent={ToggleDisplay}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      />
    </>
  );
};

storiesOf("styled-modal", module).add("Lifecycle methods", () => <LifeCycle />);
