import { ReactNode } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';
import styles from './ModalLayout.module.css';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: VoidFunction;
  isCentered?: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
};

const ModalLayout = ({
  isOpen,
  onClose,
  children,
  isCentered = true,
  closeOnEsc = true,
  closeOnOverlayClick = true,
}: Props) => {
  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onClose={onClose}
      isCentered={isCentered}
      closeOnEsc={closeOnEsc}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay />
      <ModalContent className={styles.modal}>
        <ModalCloseButton className={styles.button} />
        {children}
      </ModalContent>
    </Modal>
  );
};

export default ModalLayout;
