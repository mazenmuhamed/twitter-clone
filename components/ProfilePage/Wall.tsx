import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { collection, doc, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore';
import { IoArrowBack, IoCalendarOutline } from 'react-icons/io5';
import { User } from 'firebase/auth';

import { db } from '../../firebase';
import { Tweet } from '../../types';
import useAuth from '../../hooks/useAuth';

import Header from '../UI/Header';
import styles from './Wall.module.css';
import UserAvatar from '../UI/UserAvatar';
import EditProfileModal from './EditProfileModal';
import ProfileTabs from './ProfileTabs';

type Props = {
  user: DocumentData | User | undefined;
};

const Wall = ({ user }: Props) => {
  const [loading, setLoading] = useState(true);
  const [userTweets, setUserTweets] = useState<DocumentData[] | Tweet[]>([]);
  const [following, setFollowing] = useState<DocumentData[]>([]);
  const [followers, setFollowers] = useState<DocumentData[]>([]);
  const [isFollow, setIsFollow] = useState(false);

  const router = useRouter();
  const { user: authUser, followUser, unFollowUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get uset's tweets from firestore
  useEffect(() => {
    onSnapshot(query(collection(db, 'tweets'), orderBy('createdAt', 'desc')), snapshot => {
      setUserTweets(
        snapshot.docs.filter(doc => doc.data().uid === user?.uid).map(doc => doc.data())
      );
      setLoading(false);
    });
  }, [user?.uid]);

  // Check if the user is following the searched user
  useEffect(() => {
    if (!authUser) return;
    onSnapshot(doc(db, 'users', authUser.uid), snapshot => {
      setIsFollow(snapshot.data()?.following?.find((f: DocumentData) => f.uid === user?.uid));
    });
  }, [authUser, user?.uid]);

  // Get the searched user's followers and following
  useEffect(() => {
    if (!user) return;
    onSnapshot(doc(db, 'users', user.uid), snapshot => {
      setFollowers(snapshot.data()?.followers);
      setFollowing(snapshot.data()?.following);
    });
  }, [user]);

  if (loading) {
    return (
      <Box className="container">
        <Box className="spinner">
          <Spinner size="xl" thickness="3px" emptyColor="#1d9bf01a" color="#1d9bf0" />
        </Box>
      </Box>
    );
  }

  const month = new Date().toLocaleDateString('en', { month: 'long' });
  const year = new Date().getFullYear();

  return (
    <Box className="container">
      <Header>
        <Box className={styles['header']}>
          <Box className={styles['back-icon']} onClick={() => router.back()}>
            <IoArrowBack />
          </Box>
          <Text className={styles['header-heading']}>
            <span className={styles['header-heading-name']}>{user?.displayName}</span>
            <span className={styles['header-heading-tweets']}>{userTweets.length} Tweets</span>
          </Text>
        </Box>
      </Header>
      <Box className={styles.cover}>&nbsp;</Box>
      <Box className={styles['user-info']}>
        <Box className={styles['user-info-details']}>
          <Box className={styles['user-info-avatar']}>
            <UserAvatar
              src={user?.photoURL}
              alt={user?.displayName}
              width="13rem"
              height="13rem"
              onClick={() => {}}
            />
          </Box>
          <Box className={styles['user-info-text']}>
            <Text className={styles['user-info-name']}>{user?.displayName}</Text>
            <Text className={styles['user-info-username']}>@{user?.email?.split('@')[0]}</Text>
          </Box>
          <Box className={styles['user-info-date']}>
            <IoCalendarOutline className={styles['user-info-date-icon']} />
            <Text className={styles['user-info-date-text']}>
              Joined {month} {year}
            </Text>
          </Box>
          <Box className={styles['user-info-followers']}>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              <span style={{ fontWeight: '700' }}>{following?.length || 0} </span>
              <span>Following</span>
            </Text>
            <Text cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              <span style={{ fontWeight: '700' }}>{followers?.length || 0} </span>
              <span>Followers</span>
            </Text>
          </Box>
        </Box>
        {
          // If the user is viewing their own profile, show the edit profile button
          authUser?.uid === user?.uid ? (
            <Button variant="outline" className={styles.button} onClick={onOpen}>
              Edit profile
            </Button>
          ) : (
            // TODO: Follow button
            <Button
              variant="outline"
              className={isFollow ? styles.button : styles.follow}
              onClick={() => (isFollow ? unFollowUser(user) : followUser(user))}
            >
              {isFollow ? 'Following' : 'Follow'}
            </Button>
          )
        }
      </Box>
      {/* Tabs */}
      <ProfileTabs tweets={userTweets} />
      {/* Modal */}
      <EditProfileModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
export default Wall;
