const setAriaHidden = (active: boolean, id: string) => {
  if (!id) return;
  const element = document.getElementById(id);
  if (!element) return;
  active
    ? element.setAttribute("aria-hidden", "true")
    : element.removeAttribute("aria-hidden");
};

const on = (id: string) => setAriaHidden(true, id);

const off = (id: string) => setAriaHidden(false, id);

export default {
  on,
  off
};
