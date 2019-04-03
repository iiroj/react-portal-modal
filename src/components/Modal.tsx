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

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ children, theme, ...rest }, ref) => (
    <div {...rest} ref={ref} style={{ ...theme.modal, background: "white" }}>
      {children}
    </div>
  )
);
