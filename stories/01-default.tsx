import React from 'react';
import { storiesOf } from '@storybook/react';

import Modal from 'styled-modal';

storiesOf('styled-modal', module).add('Default stateless Modal', () => (
  <React.Fragment>
    <Modal appId="root">
      <p>This text is rendered in a Modal</p>
    </Modal>
  </React.Fragment>
));
