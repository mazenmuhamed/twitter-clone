import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { IoSparklesOutline } from 'react-icons/io5';

import useAuth from '../../../hooks/useAuth';
import Header from '../../UI/Header';
import TwitterInput from '../../UI/TwitterInput/TwitterInput';
import UserAvatar from '../../UI/UserAvatar';
import styles from './Feed.module.css';
import Tweets from './Tweets';

const Feed = () => {
  const router = useRouter();

  const { user } = useAuth();
  const username = user?.email?.split('@')[0];

  return (
    <Box className={styles.container}>
      <Header>
        <Text className={styles.title} onClick={() => router.prefetch('/home')}>
          Home
        </Text>
        <Box className={styles.icon}>
          <IoSparklesOutline />
        </Box>
      </Header>
      <Box className={styles.box}>
        <UserAvatar width="5rem" height="5rem" onClick={() => router.push('/' + username)} />
        <TwitterInput isSmall={true} autoFocus={false} />
      </Box>
      <Tweets />
    </Box>
  );
};
export default Feed;
