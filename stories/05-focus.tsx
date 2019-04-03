import * as React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import StyledModal from "../src";

const Button = styled.button`
  display: block;

  & + & {
    margin-top: 16px;
  }
`;

const FocusLock = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <StyledModal
        closeOnEsc={true}
        closeOnOutsideClick={true}
        onClose={() => setOpen(false)}
        open={open}
      >
        <Button>The focus is locked inside this modal</Button>
        <Button>We are trapped!</Button>
      </StyledModal>
    </>
  );
};

storiesOf("styled-modal", module).add("Focus Lock", () => <FocusLock />);
