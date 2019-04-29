import * as React from "react";

export interface ModalProps {
  ["aria-modal"]?: true;
  children: React.ReactNode;
  isClientSide: boolean;
  isToggled: boolean;
  open: boolean;
  role: "dialog";
  theme: {
    container: React.CSSProperties;
    modal: React.CSSProperties;
    overscroll: React.CSSProperties;
  };
}

export const Modal = React.forwardRef<HTMLElement, ModalProps>(
  ({ children, isClientSide, isToggled, theme, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ ...theme.modal, background: "white" }}
    >
      {children}
    </div>
  )
);
