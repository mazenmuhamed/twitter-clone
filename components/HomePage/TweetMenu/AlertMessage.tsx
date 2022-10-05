import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import styles from './AlertMessage.module.css';

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
};

const AlertMessage = ({ isOpen, onClose, onConfirm }: Props) => {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <AlertDialog
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      autoFocus={false}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent className={styles.content}>
          <AlertDialogHeader className={styles.header}>Delete Tweet?</AlertDialogHeader>
          <AlertDialogBody className={styles.body}>
            This can’t be undone and it will be removed from your profile, the timeline of any
            accounts that follow you, and from Twitter search results.
          </AlertDialogBody>
          <AlertDialogFooter className={styles.footer}>
            <Button className={styles.button} onClick={onConfirm} data-bg="red">
              Delete
            </Button>
            <Button variant="outline" ref={cancelRef} className={styles.button} onClick={onClose}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
export default AlertMessage;
