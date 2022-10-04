import { ModalBody } from '@chakra-ui/react';

import ModalLayout from '../UI/ModalLayout';
import TwitterInput from '../UI/TwitterInput/TwitterInput';
import UserAvatar from '../UI/UserAvatar';
import styles from './AddTweetModal.module.css';

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
};

const AddTweetModal = (props: Props) => {
  return (
    <ModalLayout
      isOpen={props.isOpen}
      onClose={props.onClose}
      isCentered={false}
      closeOnEsc={true}
      closeOnOverlayClick={true}
    >
      <ModalBody className={styles['modal-body']}>
        <UserAvatar width="5rem" height="5rem" />
        <TwitterInput onClose={props.onClose} />
      </ModalBody>
    </ModalLayout>
  );
};

export default AddTweetModal;
