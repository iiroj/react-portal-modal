import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import StyledModal from '../src'

interface ContainerProps {
    children: React.ReactNode
    className: string
    open: boolean
}

const ContainerComponent = React.forwardRef(({ children, className, open }: ContainerProps, ref) =>
    open ? (
        <div className={className} ref={ref as React.RefObject<HTMLDivElement>}>
            {children}
        </div>
    ) : null
)

const Container = styled(ContainerComponent)`
    background: rgba(242, 242, 242);
    ${(props) => props.theme.container};
`

const Modal = styled.article`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 64px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.08);
    max-width: 480px;
    min-height: 120vh;
    margin: 16px;
    position: relative;
    text-align: center;
    width: 100%;
    ${(props) => props.theme.modal};
`

storiesOf('styled-modal', module).add('Custom styles', () => (
    <StyledModal containerComponent={Container} modalComponent={Modal}>
        <p>This text is rendered in a Modal</p>
    </StyledModal>
))
