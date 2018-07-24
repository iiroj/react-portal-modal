import * as React from 'react';
import { StyledComponentClass, ThemeProvider } from 'styled-components';
import { on as focusLockOn, off as focusLockOff } from 'dom-focus-lock/umd';
import { on as scrollLockOn, off as scrollLockOff } from 'no-scroll';

import hasDom from '../utils/has-dom';
import setAriaHidden from '../utils/aria-hidden';
import Portal from './Portal';
import { container, modal, overscroll } from '../styles';
import DefaultContainer from './Container';
import DefaultOverscroll from './Overscroll';
import DefaultModal from './Modal';

export type StyledModalProps = {
  appId?: string;
  children?: any;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  containerComponent?: any;
  lockFocusWhenOpen?: boolean;
  lockScrollWhenOpen?: boolean;
  modalComponent?: any;
  onClose?: (props?: any) => any;
  onOpen?: (props?: any) => any;
  open?: boolean;
  overscrollComponent?: any;
  target?: string;
};

export type StyledModalState = {
  isClientSide: boolean;
  isToggled: boolean;
  open: boolean;
};

export default class StyledModal extends React.PureComponent<
  StyledModalProps,
  StyledModalState
> {
  static defaultProps = {
    closeOnEsc: true,
    closeOnOutsideClick: true,
    lockFocusWhenOpen: true,
    lockScrollWhenOpen: true,
    open: true
  };

  static getDerivedStateFromProps(
    props: StyledModalProps,
    state: StyledModalState
  ) {
    if (props.open !== state.open) {
      return { isToggled: true, open: props.open };
    } else {
      return null;
    }
  }

  readonly hasDom: boolean;

  modal: React.RefObject<HTMLElement>;

  constructor(props: StyledModalProps) {
    super(props);

    this.hasDom = hasDom();
    this.modal = React.createRef();

    this.state = {
      isClientSide: false,
      isToggled: false,
      open: this.props.open!
    };
  }

  componentDidMount() {
    if (this.props.open) {
      this.openModal();
    }
    this.setState({ isClientSide: true });
  }

  componentDidUpdate(prevProps: StyledModalProps) {
    if (prevProps.open !== this.props.open) {
      this.props.open ? this.openModal() : this.closeModal();
    }
  }

  componentWillUnmount() {
    this.closeModal();
  }

  render() {
    const {
      appId,
      children,
      closeOnEsc,
      closeOnOutsideClick,
      containerComponent,
      modalComponent,
      onClose,
      onOpen,
      overscrollComponent,
      target,
      ...rest
    } = this.props;
    const { open } = this.state;

    const { isClientSide, isToggled } = this.state;

    const Container = containerComponent || DefaultContainer;
    const Modal = modalComponent || DefaultModal;
    const Overscroll = overscrollComponent || DefaultOverscroll;

    return (
      <Portal target={target}>
        <ThemeProvider theme={{ container, modal, overscroll }}>
          <Container
            isClientSide={isClientSide}
            isToggled={isToggled}
            onClick={this.handleOutsideClick}
            open={open}
          >
            <Overscroll
              isClientSide={isClientSide}
              isToggled={isToggled}
              onClick={this.handleOutsideClick}
            >
              <Modal
                _ref={this.modal}
                aria-modal="true"
                innerRef={this.modal}
                isClientSide={isClientSide}
                isToggled={isToggled}
                onClick={this.stopPropagation}
                onKeyUp={this.handleKeydown}
                open={open}
                role="dialog"
                {...rest}
              >
                {children}
              </Modal>
            </Overscroll>
          </Container>
        </ThemeProvider>
      </Portal>
    );
  }

  handleCallback(callback?: () => void) {
    if (callback) {
      callback();
    }
  }

  openModal() {
    if (this.hasDom) {
      if (this.props.lockFocusWhenOpen && this.modal.current) {
        focusLockOn(this.modal.current);
      }
      if (this.props.lockScrollWhenOpen) {
        scrollLockOn();
      }
      if (this.props.appId) {
        setAriaHidden.on(this.props.appId);
      }
    }
  }

  closeModal() {
    if (this.hasDom) {
      if (this.props.lockFocusWhenOpen && this.modal.current) {
        focusLockOff(this.modal.current);
      }
      if (this.props.lockScrollWhenOpen) {
        scrollLockOff();
      }
      if (this.props.appId) {
        setAriaHidden.off(this.props.appId);
      }
    }
  }

  handleKeydown = ({ key }: React.KeyboardEvent) => {
    const { open, closeOnEsc } = this.props;
    if (closeOnEsc && open && key === 'Escape') {
      this.handleCallback(this.props.onClose);
      this.closeModal();
    }
  };

  stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  handleOutsideClick = () => {
    if (this.props.closeOnOutsideClick === true) {
      this.handleCallback(this.props.onClose);
      this.closeModal();
    }
  };
}
