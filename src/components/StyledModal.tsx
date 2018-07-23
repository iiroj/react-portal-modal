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
};

export default class StyledModal extends React.PureComponent<
  StyledModalProps,
  StyledModalState
> {
  public static defaultProps = {
    closeOnEsc: true,
    closeOnOutsideClick: true,
    lockFocusWhenOpen: true,
    lockScrollWhenOpen: true,
    open: true
  };

  private readonly hasDom: boolean;
  private modal: React.RefObject<HTMLElement>;

  private constructor(props: StyledModalProps) {
    super(props);

    this.hasDom = hasDom();
    this.modal = React.createRef();

    this.state = {
      isClientSide: false,
      isToggled: false
    };
  }

  public componentDidMount() {
    if (this.props.open) {
      this.openModal();
    }
    this.setState({ isClientSide: true });
  }

  public componentDidUpdate(prevProps: StyledModalProps) {
    if (prevProps.open !== this.props.open) {
      this.props.open ? this.openModal() : this.closeModal();
      this.setState({ isToggled: true });
    }
  }

  public componentWillUnmount() {
    this.closeModal();
  }

  public render() {
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

    // Strict null check doesn't understand defaultProps
    const open = this.props.open as boolean;

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

  public handleCallback(callback?: () => void) {
    if (callback) {
      callback();
    }
  }

  private openModal() {
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

  private closeModal() {
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

  private handleKeydown = ({ key }: React.KeyboardEvent) => {
    const { open, closeOnEsc } = this.props;
    if (closeOnEsc && open && key === 'Escape') {
      this.handleCallback(this.props.onClose);
      this.closeModal();
    }
  };

  private stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  private handleOutsideClick = () => {
    if (this.props.closeOnOutsideClick === true) {
      this.handleCallback(this.props.onClose);
      this.closeModal();
    }
  };
}
