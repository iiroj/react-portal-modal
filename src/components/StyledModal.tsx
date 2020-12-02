import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  ComponentType,
  ReactNode,
  RefObject,
  SyntheticEvent,
} from "react";
import FocusLock from "react-focus-lock";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import { hasDom } from "../utils/hasDom";
import { ariaHidden } from "../utils/ariaHidden";
import { containerStyles, modalStyles, overscrollStyles } from "../styles";

import Portal from "./Portal";
import DefaultContainer from "./Container";
import DefaultOverscroll from "./Overscroll";
import DefaultModal from "./Modal";

type PossiblyPromisefulFn = () => Promise<void> | void;

export interface StyledModalProps {
  afterClose?: PossiblyPromisefulFn;
  afterOpen?: PossiblyPromisefulFn;
  appId?: string;
  beforeClose?: PossiblyPromisefulFn;
  beforeOpen?: PossiblyPromisefulFn;
  children?: ReactNode;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  containerComponent?: ComponentType<any>;
  lockFocusWhenOpen?: boolean;
  lockScrollWhenOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalComponent?: ComponentType<any>;
  modalRef?: RefObject<HTMLElement>;
  onClose?: PossiblyPromisefulFn;
  onOpen?: PossiblyPromisefulFn;
  open?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overscrollComponent?: ComponentType<any>;
  scrollLockRef?: RefObject<HTMLElement>;
  target?: string | HTMLElement;
}

const theme = {
  container: containerStyles,
  modal: modalStyles,
  overscroll: overscrollStyles,
};

const handleCallback = (callback: PossiblyPromisefulFn) => {
  if (typeof callback === "function") {
    return callback();
  }
};

const isClientSide = hasDom();

const StyledModal = ({
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
  lockScrollWhenOpen,
  modalComponent,
  onClose,
  open = true,
  overscrollComponent,
  target,
  ...props
}: StyledModalProps): JSX.Element => {
  const modalRef = useRef<HTMLElement>(
    (props.modalRef && props.modalRef.current) || null
  );
  const scrollLockRef = useRef<HTMLElement>(
    (props.scrollLockRef && props.scrollLockRef.current) || isClientSide
      ? document.body
      : null
  );

  const [isToggled, setIsToggled] = useState(false);
  const [internalOpen, setInternalOpen] = useState(!!open);

  /**
   * Modal has been toggled, probably via user interaction
   */
  useLayoutEffect(() => {
    if (internalOpen !== open) setIsToggled(true);
  }, [internalOpen, open]);

  /**
   * Handle callback before opening Modal
   */
  const handleBeforeToggleOpen = useCallback(async () => {
    if (open && !internalOpen) {
      if (beforeOpen) await handleCallback(beforeOpen);
      setInternalOpen(true);
    }
  }, [beforeOpen, internalOpen, open, setInternalOpen]);

  /**
   * Detect change in external open state
   */
  useLayoutEffect(() => {
    if (isToggled && open) {
      handleBeforeToggleOpen();
    }
  }, [handleBeforeToggleOpen, isToggled, open]);

  /**
   * Handle callback before closing Modal
   */
  const handleBeforeToggleClose = useCallback(async () => {
    if (beforeClose) await handleCallback(beforeClose);
    if (onClose) onClose();
    setInternalOpen(false);
  }, [beforeClose, onClose, setInternalOpen]);

  /**
   * Handle callback after closing Modal
   */
  const handleAfterToggleClose = useCallback(async () => {
    if (!open && !internalOpen) {
      if (afterClose) await handleCallback(afterClose);

      if (!isClientSide) return;

      if (lockScrollWhenOpen && scrollLockRef.current) {
        enableBodyScroll(scrollLockRef.current);
      }

      if (appId) {
        ariaHidden.off(appId);
      }
    }
  }, [afterClose, appId, internalOpen, lockScrollWhenOpen, open]);

  /**
   * Handle close on ESC key press
   */
  const handleKeyPress = useCallback(
    async ({ key }: KeyboardEvent) => {
      if (open && key === "Escape") await handleBeforeToggleClose();
    },
    [handleBeforeToggleClose, open]
  );

  /**
   * Handle close on outside click
   */
  const handleOutsideClick = useCallback(
    async (event: SyntheticEvent) => {
      if (closeOnOutsideClick !== true || !onClose) return;
      const target = event.target as Node;
      if (
        target !== modalRef.current &&
        target.contains(modalRef.current as Node)
      ) {
        await handleBeforeToggleClose();
      }
    },
    [closeOnOutsideClick, handleBeforeToggleClose, onClose]
  );

  /**
   * Handle callback after opening modal
   */
  const handleAfterToggleOpen = useCallback(async () => {
    if (open && internalOpen) {
      if (afterOpen) await handleCallback(afterOpen);

      if (!isClientSide) return;

      if (lockScrollWhenOpen && scrollLockRef.current) {
        disableBodyScroll(scrollLockRef.current);
      }

      if (appId) {
        ariaHidden.on(appId);
      }

      if (closeOnEsc && onClose) {
        document.addEventListener("keyup", handleKeyPress);
      }
    }
  }, [
    afterOpen,
    appId,
    closeOnEsc,
    handleKeyPress,
    internalOpen,
    lockScrollWhenOpen,
    onClose,
    open,
  ]);

  /**
   * Detect change in internal open state
   */
  useLayoutEffect(() => {
    if (!isToggled) return;
    if (internalOpen) {
      handleAfterToggleOpen();
    } else {
      handleAfterToggleClose();
    }

    return () => {
      if (closeOnEsc && onClose) {
        document.removeEventListener("keyup", handleKeyPress);
      }
    };
  }, [
    closeOnEsc,
    handleAfterToggleClose,
    handleAfterToggleOpen,
    handleKeyPress,
    internalOpen,
    isToggled,
    onClose,
  ]);

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
};

StyledModal.displayName = "StyledModal";

export default memo(StyledModal);
