import React, { Component, Fragment } from 'react';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import StyledModal from 'styled-modal';

type ContainerComponentProps = {
  children: any;
  className?: string;
  open: boolean;
};

const ContainerComponent = ({
  children,
  className,
  open
}: ContainerComponentProps) => (
  <Transition component={false} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
    {open && (
      <div className={className} key="container">
        {children}
      </div>
    )}
  </Transition>
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
  position: relative;
  text-align: center;
  width: 100%;
  ${props => props.theme.modal};
`;

type ModalProps = ContainerComponentProps & {
  _ref: (prop: any) => any;
};

const Modal = ({ children, _ref, open }: ModalProps) => (
  <Transition
    appear={{ scale: 0.95, translateY: 50 }}
    component={false}
    enter={{
      scale: spring(1, { stiffness: 400, damping: 10 }),
      translateY: spring(0, { stiffness: 400, damping: 10 })
    }}
  >
    {open && (
      <ModalContainer innerRef={_ref} key="modal">
        {children}
      </ModalContainer>
    )}
  </Transition>
);

type State = {
  open: boolean;
};

class StateContainer extends Component<{}, State> {
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
          appId="root"
          containerComponent={Container}
          modalComponent={Modal}
          onClose={this.handleClose}
          open={this.state.open}
        >
          {this.props.children}
        </StyledModal>
      </Fragment>
    );
  }
}

storiesOf('styled-modal', module).add('Animations', () => (
  <StateContainer>
    <p>This text is rendered in a Modal</p>
  </StateContainer>
));
