import { useRouter } from 'next/router';
import { Box, Flex, Spacer, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { IoArrowBack } from 'react-icons/io5';
import Image from 'next/image';
import Moment from 'react-moment';

import { Tweet as TweetData } from '../../types';
import { db } from '../../firebase';
import useAuth from '../../hooks/useAuth';
import useTweets from '../../hooks/useTweets';
import AddReplyModal from '../HomePage/Feed/AddReplyModal';
import TweetActions from '../HomePage/TweetActions/TweetActions';
import TweetMenu from '../HomePage/TweetMenu';
import AlertMessage from '../HomePage/TweetMenu/AlertMessage';
import Header from '../UI/Header';
import TwitterInput from '../UI/TwitterInput/TwitterInput';
import UserAvatar from '../UI/UserAvatar';
import Comment from './Comment';
import styles from './Tweet.module.css';

type Props = {
  tweet: TweetData;
};

const Tweet = ({ tweet }: Props) => {
  const router = useRouter();
  const toast = useToast();

  const { user } = useAuth();
  const { likes, comments } = useTweets(tweet.id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

  const deleteTweet = async () => {
    if (!user) return;
    await deleteDoc(doc(db, 'tweets', tweet.id)).finally(() => {
      router.push('/home');
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
    <Box className="container">
      <Header>
        <Box className={styles['header']}>
          <Box className={styles['back-icon']} onClick={() => router.back()}>
            <IoArrowBack />
          </Box>
          <Text className={styles['header-heading']}>Tweet</Text>
        </Box>
      </Header>
      <Box className={styles.container}>
        <Box className={styles.tweet}>
          <Box className={styles['tweet-body']}>
            <UserAvatar
              src={tweet.photoURL}
              alt={tweet.displayName}
              width="4.5rem"
              height="4.5rem"
            />
            <Box className={styles['tweet-header']}>
              <Flex flexDirection="column">
                <Text className={styles['tweet-name']}>{tweet.displayName}</Text>
                <Text className={styles['tweet-username']}>@{tweet.username}</Text>
              </Flex>
              <Spacer />
              <Box cursor="pointer">
                <TweetMenu uid={user?.uid || ''} onDelete={onAlertOpen} />
              </Box>
            </Box>
          </Box>
          <Text className={styles['tweet-text']}>{tweet.text}</Text>
          {tweet.image && (
            <Box className={styles['image-container']}>
              <Image
                src={tweet.image}
                alt="Tweet image"
                layout="responsive"
                width="100%"
                height="100%"
                objectFit="cover"
                className={styles.image}
              />
            </Box>
          )}
          <Box className={styles['tweet-details-container']}>
            <Text className={styles['tweet-details']}>
              <Moment format="LT">{new Date(tweet.createdAt.seconds * 1000)}</Moment>
              {' · '}
              <Moment format="ll">{new Date(tweet.createdAt.seconds * 1000)}</Moment>
            </Text>
            {' · '}
            <Text as="span" className={styles['tweet-datails-from']}>
              Twitter for Iphone
            </Text>
          </Box>
          <Box className={styles.inforamtion}>
            <Text className={styles['inforamtion-text']}>
              <span className={styles['inforamtion-text-number']}>0</span>
              <span> Retweets</span>
            </Text>
            <Text className={styles['inforamtion-text']}>
              <span className={styles['inforamtion-text-number']}>{likes.length}</span>
              <span> Likes</span>
            </Text>
          </Box>
          <Box className={styles.actions}>
            <TweetActions onOpen={onOpen} tweet={tweet} hideLabel={true} isFullWidth={true} />
          </Box>
          <Box className={styles['input-container']}>
            <Text className={styles['input-container-reply-to']}>
              <span>Replying to </span>
              <span className={styles['input-container-reply-to-username']}>@{tweet.username}</span>
            </Text>
            <Flex gap="0.7rem">
              <UserAvatar width="5rem" height="5rem" />
              <TwitterInput
                isSmall={true}
                havePrivacy={false}
                hideInputBorder={true}
                autoFocus={false}
                isReply={true}
                replyTo={tweet.username}
                tweetId={tweet.id}
              />
            </Flex>
          </Box>
        </Box>
        <Box className={styles['comments-container']}>
          {comments.map(comment => {
            if (!comment.createdAt) return;
            return <Comment key={comment.id} comment={comment} tweet={tweet} />;
          })}
        </Box>
      </Box>
      {/* Modals */}
      <AddReplyModal isOpen={isOpen} onClose={onClose} tweet={tweet} />
      <AlertMessage isOpen={isAlertOpen} onClose={onAlertClose} onConfirm={deleteTweet} />
    </Box>
  );
};
export default Tweet;
