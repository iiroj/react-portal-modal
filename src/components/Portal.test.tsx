import { mount, shallow, ShallowWrapper, ReactWrapper } from "enzyme";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

import { Portal } from "./Portal";
import { collectPortals } from "../utils/collectPortals";
import { flushPortals } from "../utils/flushPortals";

describe("Portal", () => {
  let portal: ReactWrapper;

  it("Renders to and creates div#modal by default", () => {
    expect(document.body.childElementCount).toEqual(0);

    portal = mount(<Portal>test</Portal>);
    const modalContainer = document.getElementById("modal")!;

    expect(modalContainer.innerHTML).toEqual("test");
    expect(document.body.childElementCount).toEqual(1);
  });

  it("Renders to pre-existing div#modal by default", () => {
    document.body.innerHTML = '<div id="modal"></div>';
    expect(document.body.childElementCount).toEqual(1);

    portal = mount(<Portal>test</Portal>);
    const modalContainer = document.getElementById("modal")!;

    expect(modalContainer.innerHTML).toEqual("test");
    expect(document.body.childElementCount).toEqual(1);
  });

  it("Renders to and creates div with supplied id", () => {
    document.body.innerHTML = '<div id="foo"></div>';
    expect(document.body.childElementCount).toEqual(1);

    portal = mount(<Portal target="bar">test</Portal>);
    const modalContainer = document.getElementById("bar")!;

    expect(modalContainer.innerHTML).toEqual("test");
    expect(document.body.childElementCount).toEqual(2);

    const otherContainer = document.getElementById("foo")!;
    expect(otherContainer.innerHTML).toEqual("");
  });

  it("Renders to pre-existing div with supplied id", () => {
    document.body.innerHTML = '<div id="foo"></div><div id="bar"></div>';
    expect(document.body.childElementCount).toEqual(2);

    portal = mount(<Portal target="foo">test</Portal>);
    const modalContainer = document.getElementById("foo")!;

    expect(modalContainer.innerHTML).toEqual("test");
    expect(document.body.childElementCount).toEqual(2);

    const otherContainer = document.getElementById("bar")!;
    expect(otherContainer.innerHTML).toEqual("");
  });

  afterEach(() => {
    portal.unmount();
  });
});

describe("flushPortals", () => {
  it("Removes all children from the supplied target", () => {
    document.body.innerHTML =
      '<div id="modal"><div id="foo"></div><div id="bar"></div></div>';

    const modalContainer = document.getElementById("modal")!;
    expect(modalContainer.childElementCount).toEqual(2);

    flushPortals("modal");

    expect(modalContainer.childElementCount).toEqual(0);
    expect(modalContainer.innerHTML).toEqual("");
  });
});
