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

  targetNode: Element;

  componentDidMount = () => {
    this.targetNode = window.document.getElementById(this.props.targetId);
  };

  isClientSide = () => !!(typeof window !== 'undefined' && window.document && window.document.createElement);

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
    const { children, targetId } = this.props;

    if (!this.isClientSide()) {
      PORTALS.push(children);
      return null;
    }

    if (!this.targetNode) {
      this.targetNode = window.document.createElement('div');
      this.targetNode.id = targetId;
      window.document.body.appendChild(this.targetNode);
    }

    return createPortal(children, this.targetNode);
  }
}
