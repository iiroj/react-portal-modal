// @flow

import React, { Component } from 'react';
import FocusLock from 'react-focus-lock';
import noScroll from 'no-scroll';

import Portal from './Portal';
import { container, backdrop } from '../styles';
import FallbackBackdrop from './Backdrop';
import Overscroll from './Overscroll';
import FallbackContainer from './Container';

type Props = {
  backdropComponent: any,
  children?: any,
  closeOnEsc: boolean,
  closeOnOutsideClick: boolean,
  modalComponent: any,
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
    backdropComponent: FallbackBackdrop,
    closeOnEsc: false,
    closeOnOutsideClick: false,
    modalComponent: FallbackContainer,
    open: true,
  };

  container: ?Element;
  Backdrop: any;
  Overscroll: any;
  Container: any;

  constructor(props: Props) {
    super(props);

    const { open, backdropComponent: Backdrop, modalComponent: Container } = props;

    this.state = {
      open,
    };

    this.Backdrop = Backdrop.extend`
      ${backdrop};
    `;

    this.Container = Container.extend`
      ${container};
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
    noScroll.on();
    this.addEventListeners();
    this.setState({ open: true }, this.props.onOpen);
  };

  closeModal = () => {
    noScroll.off();
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

  shouldComponentUpdate = (nextProps: Props, nextState: State) =>
    this.state.open !== nextState.open ||
    this.props.open !== nextProps.open ||
    this.props.children !== nextProps.children;

  render() {
    const { children, targetId } = this.props;
    const { open } = this.state;

    const Backdrop = this.Backdrop;
    const Container = this.Container;

    return (
      <Portal targetId={targetId}>
        {open && (
          <Backdrop>
            <Overscroll>
              <Container role="dialog" innerRef={r => (this.container = r)}>
                <FocusLock returnFocus={true}>{children}</FocusLock>
              </Container>
            </Overscroll>
          </Backdrop>
        )}
      </Portal>
    );
  }
}
