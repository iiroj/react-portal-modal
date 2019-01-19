import * as React from "react";

export type ModalProps = {
  ["aria-modal"]?: true;
  children: any;
  isClientSide: boolean;
  isToggled: boolean;
  lockFocusWhenOpen: boolean;
  lockScrollWhenOpen: boolean;
  open: boolean;
  ref: React.RefObject<any>;
  role: "dialog";
  theme: {
    container: React.CSSProperties;
    modal: React.CSSProperties;
    overscroll: React.CSSProperties;
  };
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      theme,
      isClientSide,
      isToggled,
      lockFocusWhenOpen,
      lockScrollWhenOpen,
      open,
      ...rest
    },
    ref
  ) => (
    <div
      {...rest}
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ ...theme.modal, background: "white" }}
    >
      {children}
    </div>
  )
);
