import React, { forwardRef } from 'react'
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react'

export interface OverscrollProps {
    children: ReactNode
    isClientSide: boolean
    isToggled: boolean
    onClick: (event: SyntheticEvent) => void
    theme: {
        container: CSSProperties
        modal: CSSProperties
        overscroll: CSSProperties
    }
}

const Overscroll = forwardRef<HTMLDivElement, OverscrollProps>(({ children, theme, onClick }, ref) => (
    <div onClick={onClick} ref={ref} style={theme.overscroll}>
        {children}
    </div>
))

Overscroll.displayName = 'StyledModal.Overscroll'

export default Overscroll
