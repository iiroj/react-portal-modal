/**
 * @jest-environment node
 */

import React from "react";
import ReactDOMServer from "react-dom/server";

import Portal from "./Portal";
import PortalCollector from "./PortalCollector";

describe("PortalCollector", () => {
  const collectedPortals: React.ReactNode[] = [];

  it("Populates rendered portals", () => {
    ReactDOMServer.renderToString(
      <PortalCollector portals={collectedPortals}>
        <Portal>foo</Portal>
      </PortalCollector>
    );

    expect(collectedPortals).toEqual(["foo"]);
  });

  it("Supports multiple collectors", () => {
    const morePortals: React.ReactNode[] = [];

    ReactDOMServer.renderToString(
      <PortalCollector portals={morePortals}>
        <Portal>bar</Portal>
      </PortalCollector>
    );

    expect(collectedPortals).toEqual(["foo"]);
    expect(morePortals).toEqual(["bar"]);
  });
});
