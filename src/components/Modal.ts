import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

export interface ModalProps {
  _ref: (r: HTMLElement) => void;
  'aria-modal'?: 'true';
  innerRef: (r: HTMLElement) => void;
  open: boolean;
  role: 'dialog';
}

const Container = styled.div`
  background: white;
  display: inline-block;

  ${props => props.theme.modal};
`;

export default Container;
