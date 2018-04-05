import styled from 'styled-components';
import * as Styled from 'styled-components/typings/styled-components';

const Overscroll: Styled.StyledComponentClass<{}, {}> = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100%;
  position: relative;
  width: 100%;
`;

export default Overscroll;
