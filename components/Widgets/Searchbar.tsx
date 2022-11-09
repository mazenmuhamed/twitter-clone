import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { IoSearch } from 'react-icons/io5';

import { db } from '../../firebase';
import useAuth from '../../hooks/useAuth';
import styles from './Searchbar.module.css';
import UserAvatar from '../UI/UserAvatar';

type Props = {
  className?: string;
};

const Searchbar = ({ className }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [showBox, setShowBox] = useState(false);
  const [users, setUsers] = useState<DocumentData[]>([]);
  const [searchResult, setSearchResult] = useState<DocumentData[]>([]);

  const router = useRouter();
  const { user } = useAuth();

  // Get users from firestore
  useEffect(
    () =>
      onSnapshot(collection(db, 'users'), snapshot =>
        setUsers(snapshot.docs.filter(doc => doc.data().uid !== user?.uid).map(doc => doc.data()))
      ),
    [user?.uid]
  );

  // Search for users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inputValue) return setSearchResult([]);
      const result = users.filter(user => {
        if (
          user.username.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.displayName.toLowerCase().includes(inputValue.toLowerCase())
        ) {
          return user;
        }
      });
      setSearchResult(result);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, users]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box
      className={`${styles.searchbar} ${className}`}
      onFocus={() => setShowBox(true)}
      onBlur={() => setTimeout(() => setShowBox(false), 200)}
    >
      <form className={styles.container} onSubmit={submitHandler}>
        <IoSearch className={styles.icon} />
        <Input
          variant="unstyled"
          className={styles.input}
          placeholder="Search Twitter"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </form>
      <Box className={styles.box} data-show={showBox}>
        <Box className={styles['box-header']}>
          <Text className={styles['box-heading']}>Recent</Text>
          <Button variant="link" className={styles['box-button']} onClick={() => setInputValue('')}>
            Clear all
          </Button>
        </Box>
        <Box className={styles['box-content']}>
          {searchResult.length === 0 ? (
            <Text className={styles['box-placeholder']}>
              Try searching for people, topics, or keywords
            </Text>
          ) : (
            searchResult.map(user => (
              <Box
                key={user.uid}
                className={styles['box-item']}
                onClick={() => router.push(`/${user.username}`)}
              >
                <UserAvatar src={user.photoURL} alt={user.displayName} width="5rem" height="5rem" />
                <Flex flexDirection="column">
                  <Text className={styles['box-item-name']}>{user.displayName}</Text>
                  <Text className={styles['box-item-username']}>@{user.username}</Text>
                </Flex>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default Searchbar;
