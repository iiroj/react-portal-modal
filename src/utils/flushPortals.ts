import { hasDom } from './hasDom'

export function flushPortals(target = 'modal') {
    if (hasDom()) {
        const portals = document.getElementById(target)
        // eslint-disable-next-line no-unmodified-loop-condition
        while (portals !== null && portals.firstChild) {
            portals.removeChild(portals.firstChild)
        }
    }
}
