import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import Modal from '../src';

storiesOf('portal-modal', module).add('Default stateless Modal', () => (
  <Fragment>
    <Modal>
      <p>This text is rendered in a Modal</p>
    </Modal>
  </Fragment>
));
