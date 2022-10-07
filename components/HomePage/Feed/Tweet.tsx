import { useRouter } from 'next/router';
import { deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { Box, Spacer, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { IoPerson } from 'react-icons/io5';
import Image from 'next/image';

import { db } from '../../../firebase';
import { Tweet as TweetData } from '../../../types/index';
import useAuth from '../../../hooks/useAuth';
import formatDate from '../../../lib/format-date';
import UserAvatar from '../../UI/UserAvatar';
import AddReplyModal from './AddReplyModal';
import TweetMenu from '../TweetMenu';
import AlertMessage from '../TweetMenu/AlertMessage';
import styles from './Tweet.module.css';
import TweetActions from '../TweetActions/TweetActions';

type Props = {
  tweet: DocumentData | TweetData;
};

const Tweet = ({ tweet }: Props) => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

  const router = useRouter();
  const toast = useToast();

  const deleteTweet = async () => {
    if (!user) return;
    await deleteDoc(doc(db, 'tweets', tweet.id)).finally(() => {
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
    <Box className={styles.box} onClick={() => router.push(`/${tweet.username}/${tweet.id}`)}>
      {tweet.uid !== user?.uid && (
        <Box className={styles['suggestion-box']}>
          <IoPerson className={styles['suggestion-icon']} />
          <Text className={styles['suggestion-text']}>Suggestion Friend</Text>
        </Box>
      )}
      <Box className={styles.container}>
        <UserAvatar src={tweet.photoURL} alt={tweet.displayName} width="4.5rem" height="4.5rem" />
        <Box className={styles.tweet}>
          <Box className={styles.header}>
            <Text className={styles.name}>{tweet.displayName}</Text>
            <Text>@{tweet.username}</Text>•
            <Text className={styles.time}>
              {formatDate(new Date(tweet.createdAt.seconds * 1000))}
            </Text>
            <Spacer />
            <TweetMenu uid={tweet.uid} onDelete={onAlertOpen} />
          </Box>
          <Text className={styles.text}>{tweet.text}</Text>
          {tweet.image && (
            <Box className={styles['image-container']}>
              <Image
                src={tweet.image}
                alt="Tweet image"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            </Box>
          )}
          {/* Actions */}
          <TweetActions tweet={tweet} onOpen={onOpen} isFullWidth={false} />
        </Box>
      </Box>
      {/* Modals */}
      <AddReplyModal isOpen={isOpen} onClose={onClose} tweet={tweet} />
      <AlertMessage isOpen={isAlertOpen} onClose={onAlertClose} onConfirm={deleteTweet} />
    </Box>
  );
};
export default Tweet;
