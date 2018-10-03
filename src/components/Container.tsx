import * as React from 'react';

export type ContainerProps = {
  children: any;
  isClientSide: boolean;
  isToggled: boolean;
  onClick: () => void;
  open: boolean;
  theme: {
    container: React.CSSProperties;
    modal: React.CSSProperties;
    overscroll: React.CSSProperties;
  };
};

const Container = ({ children, theme, onClick, open }: ContainerProps) =>
  open ? (
    <div onClick={onClick} style={{ ...theme.container, background: 'rgba(0, 0, 0, 0.32)' }}>
      {children}
    </div>
  ) : null;

export default Container;
