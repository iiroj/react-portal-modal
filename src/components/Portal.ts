import * as React from "react";
import * as ReactDOM from "react-dom";

import { hasDom } from "../utils/hasDom";
import PORTALS from "../constants/portals";

export interface PortalProps {
  children: React.ReactNode;
  target?: string | HTMLElement;
}

export const Portal = React.memo<PortalProps>(
  ({ children, target = "modal" }) => {
    const [isClientSide] = React.useState(hasDom);
    const [
      targetElement,
      setTargetElement
    ] = React.useState<HTMLElement | null>(
      isClientSide
        ? typeof target === "string"
          ? document.getElementById(target)
          : target
        : null
    );

    React.useEffect(() => {
      if (isClientSide && !targetElement) {
        if (typeof target === "string") {
          const element = document.createElement("div");
          element.id = target;
          setTargetElement(element);
          document.body.appendChild(element);
        } else {
          setTargetElement(target);
        }
      }
    }, [isClientSide]);

    if (!isClientSide) {
      PORTALS.push(children);
      return null;
    }

    if (targetElement) {
      return ReactDOM.createPortal(children, targetElement);
    } else {
      return null;
    }
  }
);
