import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { on as focusLockOn, off as focusLockOff } from 'dom-focus-lock/umd';
import { on as scrollLockOn, off as scrollLockOff } from 'no-scroll';

import hasDom from '../utils/has-dom';
import setAriaHidden from '../utils/aria-hidden';
import Portal from './Portal';
import { container, modal, overscroll } from '../styles';
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

  readonly hasDom: boolean;

  modal: React.RefObject<HTMLElement>;

  constructor(props: StyledModalProps) {
    super(props);

    this.hasDom = hasDom();
    this.modal = React.createRef();

    this.state = {
      isClientSide: false,
      isToggled: false,
      open: props.open!
    };
  }

  componentDidMount() {
    this.setState({ isClientSide: true });
  }

  async getSnapshotBeforeUpdate(
    prevProps: StyledModalProps,
    prevState: StyledModalState
  ) {
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

    this.setState({ open });

    if (open) {
      await this.handleCallback(this.props.afterOpen);
    } else {
      await this.handleCallback(this.props.afterClose);
    }
  }

  componentWillUnmount() {
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

  handleCallback = async (callback?: PossiblyPromisefulFn) => {
    if (callback) {
      await callback();
    }
  };

  openModal = () => {
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
  };

  closeModal = () => {
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
  };

  handleKeydown = async ({ key }: React.KeyboardEvent) => {
    if (!this.props.closeOnEsc || !this.props.onClose) return;

    if (this.props.open && key === 'Escape') {
      await this.handleCallback(this.props.onClose);
    }
  };

  handleOutsideClick = async (event: React.SyntheticEvent) => {
    if (this.props.closeOnOutsideClick !== true || !this.props.onClose) return;

    const target = event.target as Node;
    if (
      target !== this.modal.current &&
      target.contains(this.modal.current as Node)
    ) {
      await this.handleCallback(this.props.onClose);
    }
  };

  stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };
}
