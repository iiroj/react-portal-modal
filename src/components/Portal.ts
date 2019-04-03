import * as React from "react";
import * as ReactDOM from "react-dom";

import { hasDom } from "../utils/hasDom";
import PORTALS from "../constants/portals";

export interface PortalProps {
  children: React.ReactNode;
  target?: string;
}

export class Portal extends React.PureComponent<PortalProps, {}> {
  public static defaultProps = {
    target: "modal"
  };

  private readonly hasDom = hasDom();
  private node?: Element;

  private createNode = () => {
    const target = this.props.target || Portal.defaultProps.target;

    const node = document.getElementById(target);

    if (this.node !== undefined) {
      return;
    }

    if (node === null) {
      this.node = document.createElement("div");
      this.node.id = target;
      document.body.appendChild(this.node);
    } else {
      this.node = node;
    }
  };

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

    const target = document.getElementById(
      this.props.target || Portal.defaultProps.target
    );

    if (target) {
      return ReactDOM.createPortal(children, target);
    }

    this.createNode();

    if (this.node) {
      return ReactDOM.createPortal(children, this.node);
    }

    return null;
  }
}
