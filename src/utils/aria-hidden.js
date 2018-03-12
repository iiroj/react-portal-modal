const setAriaHidden = (boolean, id) => {
  if (!id) return;
  const element = document.getElementById(id);
  if (!element) return;
  boolean ? element.setAttribute('aria-hidden', 'true') : element.removeAttribute('aria-hidden');
};

const on = id => setAriaHidden(true, id);

const off = id => setAriaHidden(false, id);

export default {
  on,
  off,
};
