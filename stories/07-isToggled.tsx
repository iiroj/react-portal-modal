import * as React from "react";
import styled from "styled-components";
import Transition from "react-transition-group/Transition";
import { storiesOf } from "@storybook/react";

import StyledModal, { ContainerProps, ModalProps } from "../src";

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
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: any) => (
        <Container
          style={{
            ...theme.container,
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {children}
        </Container>
      )
    }
  </Transition>
);

const ToggleDisplay = React.forwardRef(({ isToggled }: ModalProps, ref) => (
  <p
    ref={ref as React.RefObject<HTMLParagraphElement>}
    style={{ backgroundColor: "white", padding: "2rem" }}
  >
    This modal has {isToggled ? "been" : "not been"} toggled
  </p>
));

const ToggleStatus = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <h1>Modal keeps track of whether is has been toggled</h1>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <StyledModal
        appId="root"
        containerComponent={Fade}
        modalComponent={ToggleDisplay}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
};

storiesOf("styled-modal", module).add("Toggle state", () => <ToggleStatus />);
