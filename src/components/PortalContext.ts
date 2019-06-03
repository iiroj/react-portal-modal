import { createContext } from "react";

export const PortalContext = createContext<React.ReactNode[] | null>(null);

PortalContext.displayName = "PortalContext";
