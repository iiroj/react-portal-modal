import * as React from 'react';
import styled from 'styled-components';

export type ContainerProps = {
  children: any;
  className: string;
  open: boolean;
};

const Component = ({ children, className, open }: ContainerProps) =>
  open ? <div className={className}>{children}</div> : null;

const Container = styled(Component)`
  background: rgba(0, 0, 0, 0.32);
  ${props => props.theme.container};
`;

export default Container;
