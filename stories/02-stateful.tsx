import * as React from 'react'
import { storiesOf } from '@storybook/react'

import StyledModal from '../src'

const StatefulModal = () => {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <button onClick={() => setOpen(true)}>Open Modal</button>

            <StyledModal appId="root" onClose={() => setOpen(false)} open={open}>
                <p>This text is rendered in a Modal</p>
                <button onClick={() => setOpen(false)}>Close Modal</button>
            </StyledModal>
        </>
    )
}

storiesOf('styled-modal', module).add('Stateful Modal', () => <StatefulModal />)
