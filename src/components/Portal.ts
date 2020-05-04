import * as React from "react";
import * as ReactDOM from "react-dom";

import { hasDom } from "../utils/hasDom";

import { PortalContext } from "./PortalContext";

export interface PortalProps {
  children: React.ReactNode;
  target?: string | HTMLElement;
}

const isClientSide = hasDom();

export const Portal = React.memo<PortalProps>(
  ({ children, target = "modal" }) => {
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
    }, [portalTarget, target]);

    const serverSidePortals = React.useContext(PortalContext);

    if (isClientSide && portalTarget) {
      return ReactDOM.createPortal(children, portalTarget);
    } else if (Array.isArray(serverSidePortals)) {
      serverSidePortals.push(children);
    }

    return null;
  }
);
