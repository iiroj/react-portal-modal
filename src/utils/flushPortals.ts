import { hasDom } from "./hasDom";

export function flushPortals(target: string = "modal") {
  if (hasDom()) {
    const portals = document.getElementById(target);
    while (portals !== null && portals.firstChild) {
      portals.removeChild(portals.firstChild);
    }
  }
}
