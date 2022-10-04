import { Box, ModalBody, Text } from '@chakra-ui/react';
import { DocumentData } from 'firebase/firestore';

import { Tweet } from '../../../types';
import formatDate from '../../../lib/format-date';
import ModalLayout from '../../UI/ModalLayout';
import TwitterInput from '../../UI/TwitterInput/TwitterInput';
import UserAvatar from '../../UI/UserAvatar';
import styles from './AddReplyModal.module.css';

type Props = {
  tweet: DocumentData | Tweet;
  isOpen: boolean;
  onClose: VoidFunction;
};

const AddReplyModal = ({ isOpen, onClose, tweet }: Props) => {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      isCentered={false}
      closeOnEsc={true}
      closeOnOverlayClick={true}
    >
      <ModalBody className={styles['modal-body']}>
        <Box className={styles.container}>
          <Box className={styles['photo-container']}>
            <UserAvatar src={tweet.photoURL} alt={tweet.displayName} width="5rem" height="5rem" />
            <Box className={styles.line}>&nbsp;</Box>
          </Box>
          <Box className={styles.tweet}>
            <Box className={styles.header}>
              <Text className={styles.name}>{tweet.displayName}</Text>
              <Text>@{tweet.username}</Text>•
              <Text className={styles.time}>{formatDate(tweet.createdAt)}</Text>
            </Box>
            <Text className={styles.text}>{tweet.text}</Text>
            <Text className={styles.replyto}>
              Replying to <span className={styles['replyto-username']}>@{tweet.username}</span>
            </Text>
          </Box>
        </Box>
        <Box className={styles['input-container']}>
          <UserAvatar width="5rem" height="5rem" />
          <TwitterInput
            onClose={onClose}
            havePrivacy={false}
            isReply={true}
            tweetId={tweet.id}
            replyTo={tweet.username}
          />
        </Box>
      </ModalBody>
    </ModalLayout>
  );
};
export default AddReplyModal;
