import * as React from "react";

import { PortalContext } from "./PortalContext";

interface Props {
  children: React.ReactNode;
  portals: React.ReactNode[];
}

export const PortalCollector = ({ children, portals }: Props) => (
  <PortalContext.Provider value={portals}>{children}</PortalContext.Provider>
);
