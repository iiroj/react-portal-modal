import * as React from 'react';

export type ModalProps = {
  ['aria-modal']?: true;
  children: any;
  isClientSide: boolean;
  isToggled: boolean;
  lockFocusWhenOpen: boolean;
  lockScrollWhenOpen: boolean;
  open: boolean;
  ref: React.RefObject<any>;
  role: 'dialog';
  theme: {
    container: React.CSSProperties;
    modal: React.CSSProperties;
    overscroll: React.CSSProperties;
  };
};

const Modal = React.forwardRef(function Modal(
  { children, theme, isClientSide, isToggled, lockFocusWhenOpen, lockScrollWhenOpen, open, ...rest }: ModalProps,
  ref
) {
  return (
    <div {...rest} ref={ref as React.RefObject<HTMLDivElement>} style={{ ...theme.modal, background: 'white' }}>
      {children}
    </div>
  );
});

export default Modal;
