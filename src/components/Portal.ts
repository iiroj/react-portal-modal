import { memo, useContext, useEffect, useState } from 'react'
import type { ReactNode, ReactPortal } from 'react'
import { createPortal } from 'react-dom'

import { hasDom } from '../utils/hasDom'

import PortalContext from './PortalContext'

export interface PortalProps {
    children: ReactNode
    target?: string | HTMLElement
}

const isClientSide = hasDom()

const Portal = ({ children, target = 'modal' }: PortalProps): ReactPortal | null => {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(
        isClientSide ? (typeof target === 'string' ? document.getElementById(target) : target) : null
    )

    useEffect(() => {
        if (isClientSide && !portalTarget) {
            if (typeof target === 'string') {
                const element = document.createElement('div')
                element.id = target
                setPortalTarget(element)
                document.body.appendChild(element)
            } else {
                setPortalTarget(target)
            }
        }
    }, [portalTarget, target])

    const serverSidePortals = useContext(PortalContext)

    if (isClientSide && portalTarget) {
        return createPortal(children, portalTarget)
    } else if (Array.isArray(serverSidePortals)) {
        serverSidePortals.push(children)
    }

    return null
}

Portal.displayName = 'SyledModal.Portal'

export default memo(Portal)
