import { Box, Flex, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { deleteDoc, doc, DocumentData } from 'firebase/firestore';
import Image from 'next/image';

import { Comment, Tweet } from '../../types';
import { db } from '../../firebase';
import useAuth from '../../hooks/useAuth';
import formatDate from '../../lib/format-date';
import AddReplyModal from '../HomePage/Feed/AddReplyModal';
import TweetActions from '../HomePage/TweetActions/TweetActions';
import TweetMenu from '../HomePage/TweetMenu';
import AlertMessage from '../HomePage/TweetMenu/AlertMessage';
import UserAvatar from '../UI/UserAvatar';
import styles from './Comment.module.css';

type Props = {
  tweet: DocumentData | Tweet;
  comment: DocumentData | Comment;
};

const Comment = ({ comment, tweet }: Props) => {
  const toast = useToast();

  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

  const deleteComment = async () => {
    if (!user) return;
    await deleteDoc(doc(db, 'tweets', tweet.id, 'comments', comment.id)).finally(() => {
      return toast({
        render: () => (
          <Box className="toast">
            <Text>Your Tweet was deleted</Text>
          </Box>
        ),
      });
    });
  };

  return (
    <Box className={styles.comment}>
      <UserAvatar src={comment.photoURL} alt={comment.displayName} width="5rem" height="5rem" />
      <Box className={styles['comment-content']}>
        <Box className={styles['comment-header']}>
          <Flex flexDirection="column">
            <Box className={styles['comment-names']}>
              <Text className={styles['comment-name']}>{comment.displayName}</Text>
              <Text>@{comment.username}</Text>·
              <Text className={styles['comment-time']}>
                {formatDate(new Date(comment.createdAt.seconds * 1000))}
              </Text>
            </Box>
            <Text className={styles['comment-replyTo']}>
              <span>Replying to </span>
              <span className={styles['comment-replyTo-username']}>@{comment.replyTo}</span>
            </Text>
          </Flex>
          <Box margin="0.5rem">
            <TweetMenu uid={user?.uid || ''} onDelete={onAlertOpen} />
          </Box>
        </Box>
        <Box className={styles['comment-body']}>
          <Text className={styles['comment-text']}>{comment.text}</Text>
          {comment.image && (
            <Box className={styles['image-container']}>
              <Image
                src={comment.image}
                alt="comment image"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            </Box>
          )}
          <TweetActions onOpen={onOpen} tweet={tweet} comment={comment} />
        </Box>
      </Box>
      {/* Modals */}
      <AddReplyModal isOpen={isOpen} onClose={onClose} tweet={comment} />
      <AlertMessage isOpen={isAlertOpen} onClose={onAlertClose} onConfirm={deleteComment} />
    </Box>
  );
};

export default Comment;
