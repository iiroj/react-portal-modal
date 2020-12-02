import * as React from 'react'
import { storiesOf } from '@storybook/react'

import { Portal } from '../src'

storiesOf('styled-modal', module).add('Portal with custom target', () => (
    <>
        <h1>Portal can target any dom node by id</h1>
        <Portal target="error-display">
            <p>This text is portaled to Storybook's default #error-display</p>
        </Portal>
    </>
))
