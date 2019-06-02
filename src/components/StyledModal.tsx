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

export interface StyledModalProps {
  afterClose?: PossiblyPromisefulFn;
  afterOpen?: PossiblyPromisefulFn;
  appId?: string;
  beforeClose?: PossiblyPromisefulFn;
  beforeOpen?: PossiblyPromisefulFn;
  children?: React.ReactNode;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerComponent?: React.ComponentType<any>;
  lockFocusWhenOpen?: boolean;
  lockScrollWhenOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalComponent?: React.ComponentType<any>;
  modalRef?: React.RefObject<HTMLElement>;
  onClose?: PossiblyPromisefulFn;
  onOpen?: PossiblyPromisefulFn;
  open?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overscrollComponent?: React.ComponentType<any>;
  scrollLockRef?: React.RefObject<HTMLElement>;
  target?: string | HTMLElement;
}

const theme = {
  container: containerStyles,
  modal: modalStyles,
  overscroll: overscrollStyles
};

const handleCallback = (callback: PossiblyPromisefulFn) => {
  if (typeof callback === "function") {
    return callback();
  }
};

export const StyledModal = React.memo<StyledModalProps>(
  ({
    afterClose,
    afterOpen,
    appId,
    beforeClose,
    beforeOpen,
    children,
    closeOnEsc,
    closeOnOutsideClick = true,
    containerComponent,
    lockFocusWhenOpen = true,
    modalComponent,
    open = true,
    overscrollComponent,
    target,
    ...props
  }) => {
    const [isClientSide] = React.useState(hasDom);

    const modalRef = React.useRef<HTMLElement>(
      (props.modalRef && props.modalRef.current) || null
    );
    const scrollLockRef = React.useRef<HTMLElement>(
      (props.scrollLockRef && props.scrollLockRef.current) || document.body
    );

    const [isToggled, setIsToggled] = React.useState(false);
    const [internalOpen, setInternalOpen] = React.useState(!!open);

    /**
     * Modal has been toggled, probably via user interaction
     */
    React.useLayoutEffect(() => {
      if (internalOpen !== open) setIsToggled(true);
    }, [internalOpen, open]);

    /**
     * Handle callback before opening Modal
     */
    const handleBeforeToggleOpen = React.useCallback(async () => {
      if (open && !internalOpen) {
        if (beforeOpen) await handleCallback(beforeOpen);
        setInternalOpen(true);
      }
    }, [beforeOpen, internalOpen, open, setInternalOpen]);

    /**
     * Detect change in external open state
     */
    React.useLayoutEffect(() => {
      if (isToggled && open) {
        handleBeforeToggleOpen();
      }
    }, [isToggled, open]);

    /**
     * Handle callback before closing Modal
     */
    const handleBeforeToggleClose = React.useCallback(async () => {
      if (beforeClose) await handleCallback(beforeClose);
      if (props.onClose) props.onClose();
      setInternalOpen(false);
    }, [appId, beforeClose, setInternalOpen]);

    /**
     * Handle callback after closing Modal
     */
    const handleAfterToggleClose = React.useCallback(async () => {
      if (!open && !internalOpen) {
        if (afterClose) await handleCallback(afterClose);

        if (!isClientSide) return;

        if (props.lockScrollWhenOpen) {
          enableBodyScroll(scrollLockRef.current);
        }

        if (appId) {
          ariaHidden.off(appId);
        }
      }
    }, [
      afterClose,
      appId,
      internalOpen,
      isClientSide,
      open,
      props.lockScrollWhenOpen,
      scrollLockRef.current
    ]);

    /**
     * Handle close on ESC key press
     */
    const handleKeyPress = React.useCallback(
      async ({ key }: KeyboardEvent) => {
        if (open && key === "Escape") await handleBeforeToggleClose();
      },
      [handleBeforeToggleClose, open]
    );

    /**
     * Handle close on outside click
     */
    const handleOutsideClick = React.useCallback(
      async (event: React.SyntheticEvent) => {
        if (closeOnOutsideClick !== true || !props.onClose) return;
        const target = event.target as Node;
        if (
          target !== modalRef.current &&
          target.contains(modalRef.current as Node)
        ) {
          await handleBeforeToggleClose();
        }
      },
      [
        handleBeforeToggleClose,
        modalRef.current,
        closeOnOutsideClick,
        props.onClose
      ]
    );

    /**
     * Handle callback after opening modal
     */
    const handleAfterToggleOpen = React.useCallback(async () => {
      if (open && internalOpen) {
        if (afterOpen) await handleCallback(afterOpen);

        if (!isClientSide) return;

        if (props.lockScrollWhenOpen) {
          disableBodyScroll(scrollLockRef.current);
        }

        if (appId) {
          ariaHidden.on(appId);
        }

        if (closeOnEsc && props.onClose) {
          document.addEventListener("keyup", handleKeyPress);
        }
      }
    }, [
      appId,
      internalOpen,
      afterOpen,
      closeOnEsc,
      props.lockScrollWhenOpen,
      props.onClose
    ]);

    /**
     * Detect change in internal open state
     */
    React.useLayoutEffect(() => {
      if (!isToggled) return;
      if (internalOpen) {
        handleAfterToggleOpen();
      } else {
        handleAfterToggleClose();
      }

      return () => {
        if (closeOnEsc && props.onClose) {
          document.removeEventListener("keyup", handleKeyPress);
        }
      };
    }, [closeOnEsc, internalOpen, isToggled, props.onClose]);

    const Container = containerComponent || DefaultContainer;
    const Modal = modalComponent || DefaultModal;
    const Overscroll = overscrollComponent || DefaultOverscroll;

    return (
      <Portal target={target}>
        <Container
          isClientSide={isClientSide}
          isToggled={isToggled}
          onClick={handleOutsideClick}
          open={internalOpen}
          theme={theme}
        >
          <Overscroll
            isClientSide={isClientSide}
            isToggled={isToggled}
            onClick={handleOutsideClick}
            theme={theme}
          >
            <Modal
              aria-modal
              isClientSide={isClientSide}
              isToggled={isToggled}
              open={internalOpen}
              ref={modalRef}
              role="dialog"
              theme={theme}
              {...props}
            >
              <FocusLock disabled={!lockFocusWhenOpen}>{children}</FocusLock>
            </Modal>
          </Overscroll>
        </Container>
      </Portal>
    );
  }
);
