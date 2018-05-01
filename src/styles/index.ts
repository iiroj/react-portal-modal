import { css } from 'styled-components';
import * as Styled from 'styled-components/typings/styled-components';

export const container: Styled.InterpolationValue[] = css`
  height: 100%;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9000;
`;

export const overscroll: Styled.InterpolationValue[] = css`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100%;
  position: relative;
  width: 100%;
`;

export const modal: Styled.InterpolationValue[] = css`
  z-index: 9001;
`;
