import { InterpolationValue, css } from 'styled-components';

export const backdrop: InterpolationValue[] = css`
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

export const container: InterpolationValue[] = css`
  z-index: 9001;
`;
