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
};

export default class StyledModal extends React.PureComponent<StyledModalProps> {
  public static defaultProps = {
    closeOnEsc: true,
    closeOnOutsideClick: true,
    lockFocusWhenOpen: true,
    lockScrollWhenOpen: true,
    open: true
  };

  private modal: React.RefObject<HTMLElement>;

  private constructor(props: StyledModalProps) {
    super(props);

    this.modal = React.createRef();
  }

  public componentDidMount() {
    if (this.props.open) {
      this.openModal();
    }
  }

  public componentDidUpdate(prevProps: StyledModalProps) {
    if (prevProps.open !== this.props.open) {
      this.props.open ? this.openModal() : this.closeModal();
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

    const Container = containerComponent || DefaultContainer;
    const Modal = modalComponent || DefaultModal;
    const Overscroll = overscrollComponent || DefaultOverscroll;

    return (
      <Portal target={target}>
        <ThemeProvider theme={{ container, modal, overscroll }}>
          <Container open={open} onClick={this.handleOutsideClick}>
            <Overscroll onClick={this.handleOutsideClick}>
              <Modal
                aria-modal="true"
                innerRef={this.modal}
                _ref={this.modal}
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
    if (hasDom()) {
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
    if (hasDom()) {
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
