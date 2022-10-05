import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore';
import { Box, Spacer, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import {
  IoChatbubbleOutline,
  IoHeart,
  IoHeartOutline,
  IoPerson,
  IoRepeatOutline,
  IoShareOutline,
} from 'react-icons/io5';
import Image from 'next/image';
import { IconType } from 'react-icons/lib';

import { db } from '../../../firebase';
import { Tweet as TweetData } from '../../../types/index';
import useAuth from '../../../hooks/useAuth';
import formatDate from '../../../lib/format-date';
import UserAvatar from '../../UI/UserAvatar';
import AddReplyModal from './AddReplyModal';
import TweetMenu from '../TweetMenu';
import AlertMessage from '../TweetMenu/AlertMessage';
import styles from './Tweet.module.css';

type ActionProps = {
  name: string;
  label: number;
  color?: string;
  liked?: boolean;
  Icon: IconType;
  onLike?: VoidFunction;
  onComment?: VoidFunction;
  onShare?: VoidFunction;
  onRetweet?: VoidFunction;
};

const Action = (props: ActionProps) => {
  return (
    <Box className={styles.actions}>
      <Tooltip className={styles.tooltip} label={props.name}>
        <Box
          className={styles.action}
          data-bg={props.color}
          onClick={e => {
            e.stopPropagation();
            props.onLike && props.onLike();
            props.onComment && props.onComment();
          }}
        >
          <Box className={styles['action-icon']} data-liked={props.liked}>
            <props.Icon />
          </Box>
          <Text className={styles['action-label']}>{props.label}</Text>
        </Box>
      </Tooltip>
    </Box>
  );
};

type Props = {
  tweet: DocumentData | TweetData;
};

const Tweet = ({ tweet }: Props) => {
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<DocumentData[]>([]);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<DocumentData[]>([]);

  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    if (!tweet.id || !user) return;
    const unsubscribe = () => {
      // Get likes
      onSnapshot(collection(db, 'tweets', tweet.id, 'likes'), snapshot => {
        setLikes(snapshot.docs.map(doc => doc.data()));
        setLiked(snapshot.docs.some(doc => doc.data().uid === user.uid));
        setLoading(false);
      });
      // Get comments
      onSnapshot(collection(db, 'tweets', tweet.id, 'comments'), snapshot => {
        setComments(snapshot.docs.map(doc => doc.data()));
      });
    };
    unsubscribe();
  }, [tweet, user]);

  // Handlers
  const addLike = () => {
    if (!user) return;
    // Check if user has liked tweet
    if (liked) {
      deleteDoc(doc(db, 'tweets', tweet.id, 'likes', user.uid));
    } else {
      setDoc(doc(db, 'tweets', tweet.id, 'likes', user.uid), {
        uid: user.uid,
        username: user.email?.split('@')[0],
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
  };

  const deleteTweet = async () => {
    if (!user) return;
    await deleteDoc(doc(db, 'tweets', tweet.id)).finally(() => {
      return toast({
        render: () => (
          <Box className={styles.toast}>
            <Text>Your Tweet was deleted</Text>
          </Box>
        ),
      });
    });
  };

  if (loading) {
    return (
      <Box className={styles.spinner}>
        <Spinner size="xl" thickness="3px" emptyColor="#1d9bf01a" color="#1d9bf0" />;
      </Box>
    );
  }

  return (
    <Box className={styles.box}>
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
            <Text className={styles.time}>{formatDate(tweet.createdAt)}</Text>
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
          <Box className={styles.actions}>
            <Action
              name="Reply"
              label={comments.length}
              Icon={IoChatbubbleOutline}
              onComment={onOpen}
            />
            <Action name="Retweet" label={0} Icon={IoRepeatOutline} color="green" />
            <Action
              name="Like"
              color="pink"
              label={likes.length}
              liked={liked}
              Icon={liked ? IoHeart : IoHeartOutline}
              onLike={addLike}
            />
            <Action name="Share" label={0} Icon={IoShareOutline} />
          </Box>
        </Box>
      </Box>
      {/* Modals */}
      <AddReplyModal isOpen={isOpen} onClose={onClose} tweet={tweet} />
      <AlertMessage isOpen={isAlertOpen} onClose={onAlertClose} onConfirm={deleteTweet} />
    </Box>
  );
};
export default Tweet;
