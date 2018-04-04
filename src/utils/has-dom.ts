/* tslint:disable:strict-type-predicates */

export default (): boolean =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
