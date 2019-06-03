import { mount } from "enzyme";
import * as React from "react";

import { Portal } from "../components/Portal";
import { flushPortals } from "./flushPortals";

describe("flushPortals", () => {
  it("Flushes pre-existing SSR portals", () => {
    document.body.innerHTML =
      '<div id="modal"><div id="modal">Modal</div></div></div>';

    const modalContainer = document.getElementById("modal")!;
    expect(modalContainer.childElementCount).toEqual(1);
    expect(modalContainer.children[0].innerHTML).toEqual("Modal");

    flushPortals();

    mount(
      <Portal>
        <div id="modal">Modal</div>
      </Portal>
    );

    expect(modalContainer.childElementCount).toEqual(1);
  });
});
