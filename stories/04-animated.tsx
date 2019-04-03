import * as React from "react";
import Transition from "react-motion-ui-pack";
import { spring } from "react-motion";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import StyledModal from "../src";

interface ContainerComponentProps {
  children: React.ReactNode;
  className?: string;
  isClientSide: boolean;
  open: boolean;
}

const ContainerComponent = React.forwardRef<
  HTMLDivElement,
  ContainerComponentProps
>(({ children, className, isClientSide, open }, ref) =>
  isClientSide ? (
    <Transition component={false} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
      {open && (
        <div className={className} key="container" ref={ref}>
          {children}
        </div>
      )}
    </Transition>
  ) : open ? (
    <div className={className} key="container" ref={ref}>
      {children}
    </div>
  ) : null
);

const Container = styled(ContainerComponent)`
  background-color: rgb(242, 242, 242);
  ${props => props.theme.container};
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 64px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: initial;
  max-width: 480px;
  margin: 16px;
  text-align: center;
  width: 100%;
  ${props => props.theme.modal};
`;

const Modal = React.forwardRef<HTMLDivElement, ContainerComponentProps>(
  ({ children, isClientSide, open }, ref) =>
    isClientSide ? (
      <Transition
        appear={{ scale: 0.95, translateY: 50 }}
        component={false}
        enter={{
          scale: spring(1, { stiffness: 400, damping: 10 }),
          translateY: spring(0, { stiffness: 400, damping: 10 })
        }}
      >
        {open && (
          <ModalContainer ref={ref} key="modal">
            {children}
          </ModalContainer>
        )}
      </Transition>
    ) : open ? (
      <ModalContainer ref={ref} key="modal">
        {children}
      </ModalContainer>
    ) : null
);

const Animations = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <StyledModal
        appId="root"
        containerComponent={Container}
        modalComponent={Modal}
        onClose={() => setOpen(false)}
        open={open}
      >
        <p>This text is rendered in a Modal</p>
      </StyledModal>
    </>
  );
};

storiesOf("styled-modal", module).add("Animations", () => <Animations />);
