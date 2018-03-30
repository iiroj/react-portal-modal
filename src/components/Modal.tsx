import React, { Component } from 'react';
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

export interface IState {
  open: boolean;
}

export default class Modal extends Component<IProps, IState> {
  private container?: HTMLElement;

  public constructor(props: IProps) {
    super(props);

    this.state = {
      open: typeof this.props.open === 'undefined' ? true : this.props.open
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: !!this.props.open }, () => {
        if (this.state.open) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });
    }
  }

  public componentWillUnmount() {
    this.closeModalSideEffects();
  }

  public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return (
      this.state.open !== nextState.open ||
      this.props.open !== nextProps.open ||
      this.props.children !== nextProps.children ||
      this.props.modalComponent !== nextProps.modalComponent ||
      this.props.backdropComponent !== nextProps.backdropComponent
    );
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
        {this.state.open && (
          <Backdrop>
            <Overscroll>
              <Container
                aria-modal="true"
                // tslint:disable-next-line jsx-no-lambda
                innerRef={(r: HTMLElement) => (this.container = r)}
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

  private openModalSideEffects() {
    if (hasDom()) {
      focusLock.on(this.container);
      noScroll.on();
      this.addEventListeners();

      if (this.props.appId) {
        setAriaHidden.on(this.props.appId);
      }
    }
  }

  private openModal() {
    this.openModalSideEffects();
    this.setState({ open: true }, this.handleCallback(this.props.onOpen));
  }

  private closeModalSideEffects() {
    if (hasDom()) {
      focusLock.off(this.container);
      noScroll.off();
      this.removeEventListeners();

      if (this.props.appId) {
        setAriaHidden.off(this.props.appId);
      }
    }
  }

  private closeModal() {
    this.closeModalSideEffects();
    this.setState({ open: false }, this.handleCallback(this.props.onClose));
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.keyCode === 27 && this.state.open) {
      this.closeModal();
    }
  };

  private handleOutsideClick = ({ target }: MouseEvent) => {
    const container = this.container;
    if (!container || (target instanceof Node && container.contains(target))) {
      return;
    }
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
