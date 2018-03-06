// @flow

import React, { Component } from 'react';
import type { ComponentType } from 'react';

import Portal from './Portal';
import { Container, Overlay, Overscroll } from './styled';

type Props = {
  children?: ComponentType<any>,
  closeOnEsc: boolean,
  closeOnOutsideClick: boolean,
  style: {
    overlay?: string | Array<string>,
    container?: string | Array<string>,
  },
  onClose?: any => any,
  onOpen?: any => any,
  open: boolean,
  targetId?: string,
};

type State = {
  open: boolean,
};

export default class Modal extends Component<Props, State> {
  static defaultProps = {
    closeOnEsc: false,
    closeOnOutsideClick: false,
    open: true,
    style: {},
  };

  container: ?Element;
  StyledOverlay: ComponentType<any>;
  StyledContainer: ComponentType<any>;

  constructor(props: Props) {
    super(props);

    this.state = {
      open: props.open,
    };

    this.StyledOverlay = Overlay.extend`
      ${props.style.overlay};
    `;

    this.StyledContainer = Container.extend`
      ${props.style.container};
    `;
  }

  componentWillReceiveProps = ({ open }: Props) => {
    if (open !== this.state.open)
      this.setState(
        state => ({ ...state, open }),
        () => {
          if (open === true) {
            this.openModal();
          } else {
            this.closeModal();
          }
        }
      );
  };

  componentWillUnmount() {
    this.removeEventListeners();
  }

  openModal = () => {
    this.addEventListeners();
    this.setState({ open: true }, this.props.onOpen);
  };

  closeModal = () => {
    this.removeEventListeners();
    this.setState({ open: false }, this.props.onClose);
  };

  handleKeydown = (event: KeyboardEvent) => {
    if (event.keyCode === 27 && this.state.open) {
      this.closeModal();
    }
  };

  handleOutsideClick = ({ target }: MouseEvent) => {
    const container = this.container;
    if (!container || (target instanceof Node && container.contains(target))) {
      return;
    }
    this.closeModal();
  };

  addEventListeners = () => {
    if (this.props.closeOnEsc) document.addEventListener('keydown', this.handleKeydown);
    if (this.props.closeOnOutsideClick) document.addEventListener('click', this.handleOutsideClick);
  };

  removeEventListeners = () => {
    if (this.props.closeOnEsc) document.removeEventListener('keydown', this.handleKeydown);
    if (this.props.closeOnOutsideClick) document.removeEventListener('click', this.handleOutsideClick);
  };

  render() {
    const { children, targetId } = this.props;
    const { open } = this.state;

    const Overlay = this.StyledOverlay;
    const Container = this.StyledContainer;

    return (
      <Portal targetId={targetId}>
        {open && (
          <Overlay>
            <Overscroll>
              <Container role="dialog" innerRef={r => (this.container = r)}>
                {children}
              </Container>
            </Overscroll>
          </Overlay>
        )}
      </Portal>
    );
  }
}
