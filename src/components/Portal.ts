import * as React from "react";
import * as ReactDOM from "react-dom";

import { hasDom } from "../utils/hasDom";

import { PortalContext } from "./PortalContext";

export interface PortalProps {
  children: React.ReactNode;
  target?: string | HTMLElement;
}

export const Portal = React.memo<PortalProps>(
  ({ children, target = "modal" }) => {
    const [isClientSide] = React.useState(hasDom);

    const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
      isClientSide
        ? typeof target === "string"
          ? document.getElementById(target)
          : target
        : null
    );

    React.useEffect(() => {
      if (isClientSide && !portalTarget) {
        if (typeof target === "string") {
          const element = document.createElement("div");
          element.id = target;
          setPortalTarget(element);
          document.body.appendChild(element);
        } else {
          setPortalTarget(target);
        }
      }
    }, [portalTarget]);

    if (isClientSide) {
      if (portalTarget) {
        return ReactDOM.createPortal(children, portalTarget);
      }
    } else {
      const serverSidePortals = React.useContext(PortalContext);
      if (Array.isArray(serverSidePortals)) {
        serverSidePortals.push(children);
      }
    }

    return null;
  }
);
