// @flow

import { PureComponent } from 'react';
import { createPortal } from 'react-dom';

const PORTALS = [];

type Props = {
  children: any,
  targetId: string,
};

export default class Portal extends PureComponent<Props> {
  static defaultProps = {
    targetId: 'portal',
  };

  node: Element;

  componentWillMount = () => {
    if (this.isClientSide()) {
      this.createNode();
    }
  };

  isClientSide = () => !!(typeof window !== 'undefined' && window.document && window.document.createElement);

  createNode = () => {
    const { targetId } = this.props;
    const node = window.document.getElementById(targetId);

    if (node === null) {
      this.node = window.document.createElement('div');
      this.node.id = targetId;
      window.document.body.appendChild(this.node);
    } else {
      this.node = node;
    }
  };

  collectPortals = () => {
    const copy = PORTALS.slice();
    PORTALS.length = 0;
    return copy;
  };

  flushPortals = () => {
    if (this.isClientSide()) {
      const portals = document.getElementById(this.props.targetId);
      while (portals !== null && portals.firstChild) {
        portals.removeChild(portals.firstChild);
      }
    }
  };

  render() {
    const { children } = this.props;

    if (!this.isClientSide()) {
      PORTALS.push(children);
      return null;
    }

    this.createNode();

    return createPortal(children, this.node);
  }
}
