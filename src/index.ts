import StyledModal from "./components/StyledModal";

export {
  default as StyledModal,
  StyledModalProps,
} from "./components/StyledModal";

export { default as Container, ContainerProps } from "./components/Container";
export { default as Portal } from "./components/Portal";
export { default as Modal, ModalProps } from "./components/Modal";
export {
  default as Overscroll,
  OverscrollProps,
} from "./components/Overscroll";
export { default as PortalCollector } from "./components/PortalCollector";

export { flushPortals } from "./utils/flushPortals";
export { hasDom } from "./utils/hasDom";

export default StyledModal;
