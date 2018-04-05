import { PureComponent, ReactPortal } from 'react';
import ReactDOM from 'react-dom';

import hasDom from '../utils/has-dom';

const PORTALS: HTMLElement[] = [];

export function collectPortals() {
  const copy = PORTALS.slice();
  PORTALS.length = 0;
  return copy;
}

export function flushPortals() {
  if (hasDom()) {
    const portals = document.getElementById('modal');
    while (portals !== null && portals.firstChild) {
      portals.removeChild(portals.firstChild);
    }
  }
}

export interface PortalProps {
  children: any;
  target?: HTMLElement | null;
}

export default class Portal extends PureComponent<PortalProps> {
  private node?: Element;

  public componentDidMount() {
    if (hasDom() && !this.props.target) {
      this.createNode();
    }
  }

  public render() {
    const { children, target } = this.props;

    if (!hasDom()) {
      PORTALS.push(children);
      return null;
    }

    if (target) {
      return ReactDOM.createPortal(children, target);
    }

    this.createNode();

    if (this.node) {
      return ReactDOM.createPortal(children, this.node);
    }

    return null;
  }

  private createNode = () => {
    const node = window.document.getElementById('modal');

    if (this.node !== undefined) {
      return;
    }

    if (node === null) {
      this.node = window.document.createElement('div');
      this.node.id = 'modal';
      window.document.body.appendChild(this.node);
    } else {
      this.node = node;
    }
  };
}
