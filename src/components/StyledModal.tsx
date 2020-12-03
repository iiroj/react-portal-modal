import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentType, ReactNode, RefObject, SyntheticEvent } from 'react'
import FocusLock from 'react-focus-lock'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

import { hasDom } from '../utils/hasDom'
import { ariaHidden } from '../utils/ariaHidden'
import { containerStyles, modalStyles, overscrollStyles } from '../styles'

import Portal from './Portal'
import DefaultContainer from './Container'
import DefaultOverscroll from './Overscroll'
import DefaultModal from './Modal'

type PossiblyPromisefulFn = () => Promise<void> | void

export interface StyledModalProps {
    afterClose?: PossiblyPromisefulFn
    afterOpen?: PossiblyPromisefulFn
    appId?: string
    beforeClose?: PossiblyPromisefulFn
    beforeOpen?: PossiblyPromisefulFn
    children?: ReactNode
    closeOnEsc?: boolean
    closeOnOutsideClick?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    containerComponent?: ComponentType<any>
    lockFocusWhenOpen?: boolean
    lockScrollWhenOpen?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modalComponent?: ComponentType<any>
    modalRef?: RefObject<HTMLElement>
    onClose?: PossiblyPromisefulFn
    onOpen?: PossiblyPromisefulFn
    open?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overscrollComponent?: ComponentType<any>
    scrollLockRef?: RefObject<HTMLElement>
    target?: string | HTMLElement
}

const theme = {
    container: containerStyles,
    modal: modalStyles,
    overscroll: overscrollStyles,
}

const isClientSide = hasDom()

const StyledModal = ({
    afterClose,
    afterOpen,
    appId,
    beforeClose,
    beforeOpen,
    children,
    closeOnEsc = true,
    closeOnOutsideClick = true,
    containerComponent,
    lockFocusWhenOpen = true,
    lockScrollWhenOpen,
    modalComponent,
    onClose,
    open = true,
    overscrollComponent,
    target,
    ...props
}: StyledModalProps): JSX.Element => {
    const [internalOpen, setInternalOpen] = useState(!!open)
    const [isToggled, setIsToggled] = useState(false)

    const modalRef = useRef<HTMLElement>((props.modalRef && props.modalRef.current) || null)
    const scrollLockRef = useRef<HTMLElement>(
        (props.scrollLockRef && props.scrollLockRef.current) || isClientSide ? document.body : null
    )

    /**
     * Modal has been toggled, probably via user interaction
     */
    useEffect(() => {
        if (internalOpen !== open) {
            setIsToggled(true)
        }
    }, [internalOpen, open])

    /** Keep state of mounted status in ref, to prevent setting state after unmounting */
    const isMounted = useRef(true)
    useEffect(() => () => void (isMounted.current = false), [])

    /** Handle a lifecycle method by chaining it to the previous one */
    const lifecycle = useRef<Promise<void> | null>(null)
    const handleLifecycle = useCallback(async (next: PossiblyPromisefulFn) => {
        /** skip undefined methods */
        if (typeof next !== 'function') return
        /** wait for previous to complete */
        if (lifecycle.current) await lifecycle.current
        /** create next method */
        const nextPromise = async () => next()
        /** start next method, and cleanup after */
        lifecycle.current = nextPromise().then(() => void (lifecycle.current = null))
    }, [])

    /**
     * Handle close lifecycle:
     *  1. beforeClose()
     *  2. onClose()
     *  3. actually close the modal
     *  4. afterClose()
     */
    const handleClose = useCallback(async () => {
        if (!internalOpen) return
        if (beforeClose) await handleLifecycle(beforeClose)
        if (onClose) await handleLifecycle(onClose)
        if (isMounted.current) setInternalOpen(false)
        if (isClientSide) {
            if (lockScrollWhenOpen && scrollLockRef.current) enableBodyScroll(scrollLockRef.current)
            if (appId) ariaHidden.off(appId)
        }
        if (afterClose) await handleLifecycle(afterClose)
    }, [afterClose, appId, beforeClose, internalOpen, handleLifecycle, lockScrollWhenOpen, onClose])

    /**
     * Handle close on ESC key press using the external onClose prop
     */
    const handleKeyPress = useCallback(
        ({ key }: KeyboardEvent) => {
            if (open && key === 'Escape' && onClose) onClose()
        },
        [onClose, open]
    )

    /**
     * Handle close on outside click using the external onClose prop
     */
    const handleOutsideClick = useCallback(
        (event: SyntheticEvent) => {
            if (!closeOnOutsideClick || !onClose) return
            const target = event.target as Node
            if (target !== modalRef.current && target.contains(modalRef.current as Node)) {
                onClose()
            }
        },
        [closeOnOutsideClick, onClose]
    )

    /**
     * Handle open lifecycle:
     *  1. beforeOpen()
     *  2. actually open the modal
     *  3. afterOpen()
     */
    const handleOpen = useCallback(async () => {
        if (internalOpen) return
        if (beforeOpen) await handleLifecycle(beforeOpen)
        if (isMounted.current) setInternalOpen(true)
        if (isClientSide) {
            if (lockScrollWhenOpen && scrollLockRef.current) disableBodyScroll(scrollLockRef.current)
            if (appId) ariaHidden.on(appId)
        }
        if (afterOpen) await handleLifecycle(afterOpen)
    }, [afterOpen, appId, beforeOpen, internalOpen, handleLifecycle, lockScrollWhenOpen])

    /** React to changes in external `open` prop */
    useEffect(() => {
        isMounted.current = true
        if (!isToggled) return
        if (open) {
            handleOpen()
        } else {
            handleClose()
        }
    }, [handleClose, handleOpen, isToggled, open])

    /** When opening, start listening to ESC key if configured */
    useEffect(() => {
        if (!closeOnEsc || !onClose) return
        if (internalOpen) {
            document.addEventListener('keyup', handleKeyPress)
        } else {
            document.removeEventListener('keyup', handleKeyPress)
        }
        return () => void document.removeEventListener('keyup', handleKeyPress)
    }, [closeOnEsc, handleKeyPress, internalOpen, onClose])

    const Container = containerComponent || DefaultContainer
    const Modal = modalComponent || DefaultModal
    const Overscroll = overscrollComponent || DefaultOverscroll

    return (
        <Portal target={target}>
            <Container
                isClientSide={isClientSide}
                isToggled={isToggled}
                onClick={handleOutsideClick}
                open={internalOpen}
                theme={theme}
            >
                <Overscroll
                    isClientSide={isClientSide}
                    isToggled={isToggled}
                    onClick={handleOutsideClick}
                    theme={theme}
                >
                    <Modal
                        aria-modal
                        isClientSide={isClientSide}
                        isToggled={isToggled}
                        open={internalOpen}
                        ref={modalRef}
                        role="dialog"
                        theme={theme}
                        {...props}
                    >
                        <FocusLock disabled={!lockFocusWhenOpen}>{children}</FocusLock>
                    </Modal>
                </Overscroll>
            </Container>
        </Portal>
    )
}

StyledModal.displayName = 'StyledModal'

export default memo(StyledModal)
