// tslint:disable jsx-no-lambda

import React, { PureComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import focusLock from 'dom-focus-lock/umd';
import noScroll from 'no-scroll';

import hasDom from '../utils/has-dom';
import setAriaHidden from '../utils/aria-hidden';
import Portal from './Portal';
import { container, modal } from '../styles';
import DefaultContainer from './Container';
import Overscroll from './Overscroll';
import DefaultModal from './Modal';

export type StyledModalProps = {
  appId?: string;
  children?: any;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  containerComponent?: any;
  modalComponent?: any;
  onClose?: (props?: any) => any;
  onOpen?: (props?: any) => any;
  open?: boolean;
  [key: string]: any;
};

export default class StyledModal extends PureComponent<StyledModalProps> {
  public static defaultProps = {
    open: true
  };

  private container?: HTMLElement;

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
      containerComponent: ContainerComponent,
      modalComponent,
      onClose,
      onOpen,
      ...rest
    } = this.props;

    // Strict null check doesn't understand defaultProps
    const open = this.props.open as boolean;

    const Container = ContainerComponent || DefaultContainer;
    const Modal = modalComponent || DefaultModal;

    return (
      <Portal>
        <ThemeProvider theme={{ container, modal }}>
          <Container open={open}>
            <Overscroll>
              <Modal
                aria-modal="true"
                innerRef={(r: HTMLElement) => (this.container = r)}
                _ref={(r: HTMLElement) => (this.container = r)}
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
      focusLock.on(this.container);
      noScroll.on();
      this.addEventListeners();

      if (this.props.appId) {
        setAriaHidden.on(this.props.appId);
      }
    }
  }

  private closeModal() {
    if (hasDom()) {
      focusLock.off(this.container);
      noScroll.off();
      this.removeEventListeners();

      if (this.props.appId) {
        setAriaHidden.off(this.props.appId);
      }
    }
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.keyCode === 27 && this.props.open) {
      this.handleCallback(this.props.onClose);
      this.closeModal();
    }
  };

  private handleOutsideClick = ({ target }: MouseEvent) => {
    const container = this.container;
    if (!container || (target instanceof Node && container.contains(target))) {
      return;
    }
    this.handleCallback(this.props.onClose);
    this.closeModal();
  };

  private addEventListeners() {
    if (this.props.closeOnEsc !== false) {
      document.addEventListener('keydown', this.handleKeydown);
    }
    if (this.props.closeOnOutsideClick !== false) {
      document.addEventListener('click', this.handleOutsideClick);
    }
  }

  private removeEventListeners() {
    if (this.props.closeOnEsc !== false) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    if (this.props.closeOnOutsideClick !== false) {
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }
}
