import * as React from 'react';
import * as ReactDOM from 'react-dom';

import hasDom from '../utils/has-dom';

const PORTALS: HTMLElement[] = [];

export function collectPortals() {
  const copy = PORTALS.slice();
  PORTALS.length = 0;
  return copy;
}

export function flushPortals(target: string = 'modal') {
  if (hasDom()) {
    const portals = document.getElementById(target);
    while (portals !== null && portals.firstChild) {
      portals.removeChild(portals.firstChild);
    }
  }
}

export type PortalProps = {
  children: any;
  target?: string;
};

export default class Portal extends React.PureComponent<PortalProps, {}> {
  public static defaultProps = {
    target: 'modal'
  };

  private readonly hasDom: boolean;
  private node?: Element;

  constructor(props: PortalProps) {
    super(props);
    this.hasDom = hasDom();
  }

  public componentDidMount() {
    if (this.hasDom) {
      this.createNode();
    }
  }

  public render() {
    const { children } = this.props;

    if (!this.hasDom) {
      PORTALS.push(children);
      return null;
    }

    const target = document.getElementById(this.props.target!);

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
    const target = this.props.target!;

    const node = document.getElementById(target);

    if (this.node !== undefined) {
      return;
    }

    if (node === null) {
      this.node = document.createElement('div');
      this.node.id = target;
      document.body.appendChild(this.node);
    } else {
      this.node = node;
    }
  };
}
