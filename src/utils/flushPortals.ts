import { hasDom } from './hasDom'

export const flushPortals = (target = 'modal'): void => {
    if (hasDom()) {
        const portals = document.getElementById(target)
        // eslint-disable-next-line no-unmodified-loop-condition
        while (portals !== null && portals.firstChild) {
            portals.removeChild(portals.firstChild)
        }
    }
}
