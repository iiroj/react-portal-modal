import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import Modal from '../src';

const Overlay = styled.div`
  background-color: rgba(242, 242, 242, 0.96);
  padding: 32px 16px;
`;

const Container = styled.article`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 64px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  padding: 16px;
  position: relative;
  text-align: center;
  width: 100%;
`;

storiesOf('portal-modal', module).add('Custom styles', () => (
  <Fragment>
    <Modal backdropComponent={Overlay} modalComponent={Container}>
      <p>This text is rendered in a Modal</p>
    </Modal>
  </Fragment>
));
