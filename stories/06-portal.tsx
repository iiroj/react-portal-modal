import React from 'react';
import { storiesOf } from '@storybook/react';

import { Portal } from '../src';

storiesOf('styled-modal', module).add('Portal with custom target', () => {
  const target = 'error-display';

  return (
    <>
      <h1>Portal can target any dom node by id</h1>
      <Portal target={target}>
        <p>This text is portaled to Storybook's default #error-display</p>
      </Portal>
    </>
  );
});
