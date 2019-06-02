/**
 * @jest-environment node
 */

import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

import { Portal } from "./Portal";
import { collectPortals } from "../utils/collectPortals";

describe("collectPortals", () => {
  it("Returns all elements from the global array", () => {
    ReactDOMServer.renderToString(<Portal>test</Portal>);
    const collectedPortals = collectPortals();
    expect(collectedPortals).toEqual(["test"]);
  });

  it("Clears elements after returning them", () => {
    ReactDOMServer.renderToString(<Portal>foo</Portal>);
    const collectedPortals = collectPortals();
    expect(collectedPortals).toEqual(["foo"]);

    ReactDOMServer.renderToString(<Portal>bar</Portal>);
    const collectedPortals2 = collectPortals();
    expect(collectedPortals2).toEqual(["bar"]);
  });
});
