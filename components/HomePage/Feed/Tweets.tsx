import { Box, Spinner } from '@chakra-ui/react';

import useTweets from '../../../hooks/useTweets';
import Tweet from './Tweet';
import styles from './Tweets.module.css';

const Tweets = () => {
  const { tweets, tweetsLoading } = useTweets();

  if (tweetsLoading) {
    return (
      <Box className={styles.spinner}>
        <Spinner size="xl" thickness="3px" emptyColor="#1d9bf01a" color="#1d9bf0" />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      {tweets.map(tweet => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </Box>
  );
};

export default Tweets;
