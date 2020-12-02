import React, { forwardRef, SyntheticEvent } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export interface ContainerProps {
    children: ReactNode
    isClientSide: boolean
    isToggled: boolean
    onClick: (event: SyntheticEvent) => void
    open: boolean
    theme: {
        container: CSSProperties
        modal: CSSProperties
        overscroll: CSSProperties
    }
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children, theme, onClick, open }, ref) =>
    open ? (
        <div onClick={onClick} ref={ref} style={{ ...theme.container, background: 'rgba(0, 0, 0, 0.32)' }}>
            {children}
        </div>
    ) : null
)

Container.displayName = 'StyledModal.Container'

export default Container
