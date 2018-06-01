import * as React from 'react';
import { StyledComponentClass, ThemeProvider } from 'styled-components';

import hasDom from '../utils/has-dom';
import setAriaHidden from '../utils/aria-hidden';
import Portal from './Portal';
import { container, modal, overscroll } from '../styles';
import DefaultContainer from './Container';
import DefaultOverscroll from './Overscroll';
import DefaultModal from './Modal';

export interface StyledModalProps {
  appId?: string;
  children?: any;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  containerComponent?: any;
  lockFocusWhenOpen?: boolean;
  lockScrollWhenOpen?: boolean;
  modalComponent?: any;
  onClose?: (props?: any) => any;
  onOpen?: (props?: any) => any;
  open?: boolean;
  overscrollComponent?: any;
}

export default class StyledModal extends React.PureComponent<StyledModalProps> {
  public static defaultProps = {
    closeOnEsc: true,
    closeOnOutsideClick: true,
    lockFocusWhenOpen: true,
    lockScrollWhenOpen: true,
    open: true
  };

  private container: React.RefObject<HTMLElement>;

  private lockFocus?: {
    on(element?: HTMLElement): void;
    off(element?: HTMLElement): void;
  };

  private disableScroll?: {
    on(): void;
    off(): void;
  };

  private constructor(props: StyledModalProps) {
    super(props);

    this.container = React.createRef();

    if (props.lockFocusWhenOpen === true) {
      import('dom-focus-lock/umd')
        .then(({ on, off }) => (this.lockFocus = { on, off }))
        .catch();
    }

    if (props.lockScrollWhenOpen === true) {
      import('no-scroll')
        .then(({ on, off }) => (this.disableScroll = { on, off }))
        .catch();
    }
  }

  public componentDidMount() {
    if (this.props.open) {
      this.openModal();
    }
  }

  public componentDidUpdate(prevProps: StyledModalProps) {
    if (prevProps.open !== this.props.open) {
      this.props.open ? this.openModal() : this.closeModal();
    }
  }

  public componentWillUnmount() {
    this.closeModal();
  }

  public render() {
    const {
      appId,
      children,
      closeOnEsc,
      closeOnOutsideClick,
      containerComponent,
      modalComponent,
      onClose,
      onOpen,
      overscrollComponent,
      ...rest
    } = this.props;

    // Strict null check doesn't understand defaultProps
    const open = this.props.open as boolean;

    const Container = containerComponent || DefaultContainer;
    const Modal = modalComponent || DefaultModal;
    const Overscroll = overscrollComponent || DefaultOverscroll;

    return (
      <Portal>
        <ThemeProvider theme={{ container, modal, overscroll }}>
          <Container open={open}>
            <Overscroll>
              <Modal
                aria-modal="true"
                innerRef={this.container}
                _ref={this.container}
                open={open}
                role="dialog"
                {...rest}
              >
                {children}
              </Modal>
            </Overscroll>
          </Container>
        </ThemeProvider>
      </Portal>
    );
  }

  public handleCallback(callback?: () => void) {
    if (callback) {
      callback();
    }
  }

  private openModal() {
    if (hasDom()) {
      if (this.lockFocus && this.container.current) {
        this.lockFocus.on(this.container.current);
      }
      if (this.disableScroll) {
        this.disableScroll.on();
      }
      if (this.props.appId) {
        setAriaHidden.on(this.props.appId);
      }

      this.addEventListeners();
    }
  }

  private closeModal() {
    if (hasDom()) {
      if (this.lockFocus && this.container.current) {
        this.lockFocus.off(this.container.current);
      }
      if (this.disableScroll) {
        this.disableScroll.off();
      }
      if (this.props.appId) {
        setAriaHidden.off(this.props.appId);
      }

      this.removeEventListeners();
    }
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.keyCode === 27 && this.props.open) {
      this.handleCallback(this.props.onClose);
      this.closeModal();
    }
  };

  private handleOutsideClick = ({ target }: MouseEvent) => {
    const container = this.container.current;
    if (!container || (target instanceof Node && container.contains(target))) {
      return;
    }
    this.handleCallback(this.props.onClose);
    this.closeModal();
  };

  private addEventListeners() {
    if (this.props.closeOnEsc === true) {
      document.addEventListener('keydown', this.handleKeydown);
    }
    if (this.props.closeOnOutsideClick === true) {
      document.addEventListener('click', this.handleOutsideClick);
    }
  }

  private removeEventListeners() {
    if (this.props.closeOnEsc === true) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    if (this.props.closeOnOutsideClick === true) {
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }
}
