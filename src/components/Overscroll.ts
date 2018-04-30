import styled from 'styled-components';
import * as Styled from 'styled-components/typings/styled-components';

const Overscroll: Styled.StyledComponentClass<{}, {}> = styled.div`
  ${props => props.theme.overscroll};
`;

export default Overscroll;
