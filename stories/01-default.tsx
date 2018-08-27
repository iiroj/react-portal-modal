import * as React from 'react';
import { storiesOf } from '@storybook/react';

import StyledModal from '../src';

storiesOf('styled-modal', module).add('Default stateless Modal', () => (
  <React.Fragment>
    <StyledModal appId="root">
      <p>This text is rendered in a Modal</p>
    </StyledModal>
  </React.Fragment>
));
