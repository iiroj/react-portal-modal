import PORTALS from "../constants/portals";

export function collectPortals() {
  const copy = PORTALS.slice();
  PORTALS.length = 0;
  return copy;
}
