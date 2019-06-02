export const hasDom = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined";
