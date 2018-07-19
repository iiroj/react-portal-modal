export default (): boolean =>
  (typeof window as Partial<Window>) !== 'undefined' &&
  (typeof window.document as Partial<Document>) !== 'undefined';
