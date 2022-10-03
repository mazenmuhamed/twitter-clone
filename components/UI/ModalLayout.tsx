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
};

const ModalLayout = ({ children, isOpen, onClose }: Props) => {
  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
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
