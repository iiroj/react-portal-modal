import { createContext } from "react";
import type { ReactNode } from "react";

const PortalContext = createContext<ReactNode[] | null>(null);

PortalContext.displayName = "PortalContext";

export default PortalContext;
