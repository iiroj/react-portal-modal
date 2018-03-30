import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled, { StyledComponentClass } from 'styled-components';

import Modal from 'styled-modal';

const Overlay: StyledComponentClass<any, any> = styled.div`
  background-color: rgba(242, 242, 242, 0.96);
`;

const Container: StyledComponentClass<any, any> = styled.article`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 64px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  min-height: 120vh;
  margin: 16px;
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
