const setAriaHidden = (active: boolean, id: string) => {
    if (!id) return
    const element = document.getElementById(id)
    if (!element) return
    active ? element.setAttribute('aria-hidden', 'true') : element.removeAttribute('aria-hidden')
}

const on = (id: string): void => setAriaHidden(true, id)

const off = (id: string): void => setAriaHidden(false, id)

export const ariaHidden = {
    on,
    off,
}
