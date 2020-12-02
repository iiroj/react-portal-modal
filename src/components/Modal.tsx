import React, { forwardRef, MutableRefObject } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface ModalProps {
  ["aria-modal"]?: true;
  children: ReactNode;
  isClientSide: boolean;
  isToggled: boolean;
  open: boolean;
  role: "dialog";
  theme: {
    container: CSSProperties;
    modal: CSSProperties;
    overscroll: CSSProperties;
  };
}

const Modal = forwardRef<HTMLElement, ModalProps>(
  ({ children, isClientSide, isToggled, theme, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref as MutableRefObject<HTMLDivElement | null>}
      style={{ ...theme.modal, background: "white" }}
    >
      {children}
    </div>
  )
);

Modal.displayName = "StyledModal.Modal";

export default Modal;
