import { css } from 'styled-components';
import * as Styled from 'styled-components/typings/styled-components';

export const container: Styled.InterpolationValue[] = css`
  align-items: flex-start;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9000;
`;

export const modal: Styled.InterpolationValue[] = css`
  z-index: 9001;
`;
