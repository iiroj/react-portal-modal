// tslint:disable jsx-no-lambda

import React, { PureComponent } from 'react';
import { StyledComponentClass } from 'styled-components';
import focusLock from 'dom-focus-lock/umd';
import noScroll from 'no-scroll';

import hasDom from '../utils/has-dom';
import setAriaHidden from '../utils/aria-hidden';
import Portal from './Portal';
import {
  container as containerStyles,
  backdrop as backdropStyles
} from '../styles';
import FallbackBackdrop from './Backdrop';
import Overscroll from './Overscroll';
import FallbackContainer from './Container';

export interface IProps {
  appId?: string;
  backdropComponent?: StyledComponentClass<any, any>;
  children?: any;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  modalComponent?: StyledComponentClass<any, any>;
  onClose?: (props?: any) => any;
  onOpen?: (props?: any) => any;
  open?: boolean;
  [key: string]: any;
}

export default class Modal extends PureComponent<IProps> {
  public static defaultProps = {
    open: true
  };

  private container?: HTMLElement;

  public componentDidMount() {
    if (this.props.open) {
      this.openModal();
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: !!this.props.open }, () => {
        if (this.props.open) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });
    }
  }

  public componentWillUnmount() {
    this.closeModal();
  }

  public render() {
    const {
      appId,
      backdropComponent,
      children,
      closeOnEsc,
      closeOnOutsideClick,
      modalComponent,
      onClose,
      onOpen,
      open,
      ...rest
    } = this.props;

    const backdrop = backdropComponent || FallbackBackdrop;
    const Backdrop = backdrop.extend`${backdropStyles}`;

    const container = modalComponent || FallbackContainer;
    const Container = container.extend`${containerStyles}`;

    return (
      <Portal>
        {open && (
          <Backdrop>
            <Overscroll>
              <Container
                aria-modal="true"
                innerRef={(r: HTMLElement) => (this.container = r)}
                _ref={(r: HTMLElement) => (this.container = r)}
                role="dialog"
                {...rest}
              >
                {children}
              </Container>
            </Overscroll>
          </Backdrop>
        )}
      </Portal>
    );
  }

  public handleCallback(callback?: (props?: any) => any): any {
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
