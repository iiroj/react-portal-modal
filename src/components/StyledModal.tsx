import * as React from "react";
import FocusLock from "react-focus-lock";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import { hasDom } from "../utils/hasDom";
import { ariaHidden } from "../utils/ariaHidden";
import { containerStyles, modalStyles, overscrollStyles } from "../styles";

import { Portal } from "./Portal";
import { Container as DefaultContainer } from "./Container";
import { Overscroll as DefaultOverscroll } from "./Overscroll";
import { Modal as DefaultModal } from "./Modal";

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
  scrollLockRef?: React.RefObject<any>;
  target?: string;
};

export type StyledModalState = {
  isClientSide: boolean;
  isToggled: boolean;
  open: boolean;
};

const theme = {
  container: containerStyles,
  modal: modalStyles,
  overscroll: overscrollStyles
};

export class StyledModal extends React.PureComponent<
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

  public state: StyledModalState = {
    isClientSide: false,
    isToggled: false,
    open: this.props.open!
  };

  private readonly hasDom = hasDom();
  private readonly modalRef = React.createRef();
  private readonly getScrollLockRef = () =>
    this.props.scrollLockRef ? this.props.scrollLockRef.current : document.body;

  public componentDidMount() {
    this.setState({ isClientSide: true });
  }

  public async getSnapshotBeforeUpdate(
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

  public async componentDidUpdate(prevProps: StyledModalProps) {
    if (this.props.closeOnEsc && this.props.onClose) {
      document.addEventListener("keyup", this.handleKeyUp);
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

    this.setState({ open }, () =>
      open ? this.openModal() : this.closeModal()
    );

    if (open) {
      await this.handleCallback(this.props.afterOpen);
    } else {
      await this.handleCallback(this.props.afterClose);
    }
  }

  public componentWillUnmount() {
    if (this.props.closeOnEsc && this.props.onClose) {
      document.removeEventListener("keyup", this.handleKeyUp);
    }

    this.closeModal();
  }

  public render() {
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
      lockFocusWhenOpen,
      modalComponent,
      overscrollComponent,
      target,
      ...rest
    } = this.props;
    const { open, isClientSide, isToggled } = this.state;

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
          <Overscroll
            isClientSide={isClientSide}
            isToggled={isToggled}
            onClick={this.handleOutsideClick}
            theme={theme}
          >
            <Modal
              aria-modal="true"
              isClientSide={isClientSide}
              isToggled={isToggled}
              open={open}
              ref={this.modalRef}
              role="dialog"
              theme={theme}
              {...rest}
            >
              <FocusLock disabled={!lockFocusWhenOpen}>{children}</FocusLock>
            </Modal>
          </Overscroll>
        </Container>
      </Portal>
    );
  }

  private handleCallback = async (callback?: PossiblyPromisefulFn) => {
    if (callback) {
      await callback();
    }
  };

  private openModal = () => {
    if (this.hasDom) {
      if (this.props.lockScrollWhenOpen) {
        disableBodyScroll(this.getScrollLockRef());
      }
      if (this.props.appId) {
        ariaHidden.on(this.props.appId);
      }
    }
  };

  private closeModal = () => {
    if (this.hasDom) {
      if (this.props.lockScrollWhenOpen) {
        enableBodyScroll(this.getScrollLockRef());
      }
      if (this.props.appId) {
        ariaHidden.off(this.props.appId);
      }
    }
  };

  private handleKeyUp = async ({ key }: KeyboardEvent) => {
    if (!this.props.closeOnEsc || !this.props.onClose) return;

    if (this.props.open && key === "Escape") {
      await this.handleCallback(this.props.onClose);
    }
  };

  private handleOutsideClick = async (event: React.SyntheticEvent) => {
    if (this.props.closeOnOutsideClick !== true || !this.props.onClose) return;

    const target = event.target as Node;
    if (
      target !== this.modalRef.current &&
      target.contains(this.modalRef.current as Node)
    ) {
      await this.handleCallback(this.props.onClose);
    }
  };
}
