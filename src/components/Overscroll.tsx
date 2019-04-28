import * as React from "react";

export interface OverscrollProps {
  children: React.ReactNode;
  isClientSide: boolean;
  isToggled: boolean;
  onClick: (event: React.SyntheticEvent) => void;
  theme: {
    container: React.CSSProperties;
    modal: React.CSSProperties;
    overscroll: React.CSSProperties;
  };
}

export const Overscroll = React.forwardRef<HTMLDivElement, OverscrollProps>(
  ({ children, theme, onClick }, ref) => (
    <div onClick={onClick} ref={ref} style={theme.overscroll}>
      {children}
    </div>
  )
);
