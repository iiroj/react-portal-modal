import * as React from 'react';

export type OverscrollProps = {
  children: any;
  isClientSide: boolean;
  isToggled: boolean;
  onClick: () => void;
  theme: {
    container: React.CSSProperties;
    modal: React.CSSProperties;
    overscroll: React.CSSProperties;
  };
};

const Overscroll = ({ children, theme, onClick }: OverscrollProps) => (
  <div onClick={onClick} style={theme.overscroll}>
    {children}
  </div>
);

export default Overscroll;
