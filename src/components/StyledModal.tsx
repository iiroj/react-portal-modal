import * as React from 'react';
import { on as focusLockOn, off as focusLockOff } from 'dom-focus-lock/umd';
import { on as scrollLockOn, off as scrollLockOff } from 'no-scroll';

import hasDom from '../utils/has-dom';
import setAriaHidden from '../utils/aria-hidden';
import { containerStyles, modalStyles, overscrollStyles } from '../styles';

import Portal from './Portal';
import DefaultContainer from './Container';
import DefaultOverscroll from './Overscroll';
import DefaultModal from './Modal';

type PossiblyPromisefulFn = () => Promise<void> | void;

export type StyledModalProps = {
  afterClose?: PossiblyPromisefulFn;
  afterOpen?: PossiblyPromisefulFn;
  appId?: string;
  beforeClose?: PossiblyPromisefulFn;
  beforeOpen?: PossiblyPromisefulFn;
  children?: any;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  containerComponent?: any;
  lockFocusWhenOpen?: boolean;
  lockScrollWhenOpen?: boolean;
  modalComponent?: any;
  onClose?: PossiblyPromisefulFn;
  onOpen?: PossiblyPromisefulFn;
  open?: boolean;
  overscrollComponent?: any;
  target?: string;
};

export type StyledModalState = {
  isClientSide: boolean;
  isToggled: boolean;
  modal?: React.RefObject<any>;
  open: boolean;
};

const theme = {
  container: containerStyles,
  modal: modalStyles,
  overscroll: overscrollStyles
};

export default class StyledModal extends React.PureComponent<StyledModalProps, StyledModalState> {
  static defaultProps = {
    closeOnEsc: true,
    closeOnOutsideClick: true,
    lockFocusWhenOpen: true,
    lockScrollWhenOpen: true,
    open: true
  };

  readonly hasDom: boolean;

  constructor(props: StyledModalProps) {
    super(props);

    this.hasDom = hasDom();

    this.state = {
      isClientSide: false,
      isToggled: false,
      open: props.open!,
      modal: React.createRef()
    };
  }

  componentDidMount() {
    this.setState({ isClientSide: true });
  }

  async getSnapshotBeforeUpdate(prevProps: StyledModalProps, prevState: StyledModalState) {
    const { open } = this.props;
    const { isClientSide } = prevState;
    const { isToggled } = this.state;

    if (!isClientSide || (isToggled && prevProps.open === open)) {
      return null;
    }

    if (open) {
      return true;
    } else {
      return false;
    }
  }

  async componentDidUpdate(prevProps: StyledModalProps) {
    if (this.props.closeOnEsc && this.props.onClose) {
      document.addEventListener('keyup', this.handleKeyUp);
    }

    const open = this.props.open!;
    const isToggled = this.state.isToggled || prevProps.open !== open;

    this.setState({ isToggled });

    if (isToggled && prevProps.open === open) return;

    if (isToggled) {
      if (open) {
        await this.handleCallback(this.props.beforeOpen);
      } else {
        await this.handleCallback(this.props.beforeClose);
      }
    }

    this.setState({ open }, () => (open ? this.openModal() : this.closeModal()));

    if (open) {
      await this.handleCallback(this.props.afterOpen);
    } else {
      await this.handleCallback(this.props.afterClose);
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc && this.props.onClose) {
      document.removeEventListener('keyup', this.handleKeyUp);
    }

    this.closeModal();
  }

  render() {
    const {
      afterClose,
      afterOpen,
      appId,
      beforeClose,
      beforeOpen,
      children,
      closeOnEsc,
      closeOnOutsideClick,
      containerComponent,
      modalComponent,
      overscrollComponent,
      target,
      ...rest
    } = this.props;

    const { open } = this.state;

    const { isClientSide, isToggled, modal } = this.state;

    const Container = containerComponent || DefaultContainer;
    const Modal = modalComponent || DefaultModal;
    const Overscroll = overscrollComponent || DefaultOverscroll;

    return (
      <Portal target={target}>
        <Container
          isClientSide={isClientSide}
          isToggled={isToggled}
          onClick={this.handleOutsideClick}
          open={open}
          theme={theme}
        >
          <Overscroll isClientSide={isClientSide} isToggled={isToggled} onClick={this.handleOutsideClick} theme={theme}>
            <Modal
              aria-modal="true"
              isClientSide={isClientSide}
              isToggled={isToggled}
              open={open}
              ref={modal}
              role="dialog"
              theme={theme}
              {...rest}
            >
              {children}
            </Modal>
          </Overscroll>
        </Container>
      </Portal>
    );
  }

  handleCallback = async (callback?: PossiblyPromisefulFn) => {
    if (callback) {
      await callback();
    }
  };

  openModal = () => {
    if (this.hasDom) {
      if (this.props.lockFocusWhenOpen && this.state.modal!.current) {
        focusLockOn(this.state.modal!.current);
      }
      if (this.props.lockScrollWhenOpen) {
        scrollLockOn();
      }
      if (this.props.appId) {
        setAriaHidden.on(this.props.appId);
      }
    }
  };

  closeModal = () => {
    if (this.hasDom) {
      if (this.props.lockFocusWhenOpen && this.state.modal!.current) {
        focusLockOff(this.state.modal!.current);
      }
      if (this.props.lockScrollWhenOpen) {
        scrollLockOff();
      }
      if (this.props.appId) {
        setAriaHidden.off(this.props.appId);
      }
    }
  };

  handleKeyUp = async ({ key }: KeyboardEvent) => {
    if (!this.props.closeOnEsc || !this.props.onClose) return;

    if (this.props.open && key === 'Escape') {
      await this.handleCallback(this.props.onClose);
    }
  };

  handleOutsideClick = async (event: React.SyntheticEvent) => {
    if (this.props.closeOnOutsideClick !== true || !this.props.onClose) return;

    const target = event.target as Node;
    if (target !== this.state.modal!.current && target.contains(this.state.modal!.current as Node)) {
      await this.handleCallback(this.props.onClose);
    }
  };

  stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };
}
