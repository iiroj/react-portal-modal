import React from 'react'
import type { ReactNode } from 'react'

import PortalContext from './PortalContext'

interface Props {
    children: ReactNode
    portals: ReactNode[]
}

const PortalCollector = ({ children, portals }: Props) => (
    <PortalContext.Provider value={portals}>{children}</PortalContext.Provider>
)

PortalCollector.displayName = 'StyledModal.PortalCollector'

export default PortalCollector
