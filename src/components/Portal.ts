import React from 'react';
import { createPortal } from 'react-dom';

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

export interface IProps {
  children: any;
  target?: HTMLElement | null;
}

export default class Portal extends React.PureComponent<IProps> {
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
      return createPortal(children, target);
    }

    this.createNode();

    if (this.node) {
      return createPortal(children, this.node);
    }
  }

  private createNode = () => {
    const node = window.document.getElementById('modal');

    if (node === null) {
      this.node = window.document.createElement('div');
      this.node.id = 'modal';
      window.document.body.appendChild(this.node);
    } else {
      this.node = node;
    }
  };
}
