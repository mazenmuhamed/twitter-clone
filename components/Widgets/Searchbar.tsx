import { FormEvent, useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { IoSearch } from 'react-icons/io5';
import styles from './Searchbar.module.css';

const Searchbar = () => {
  const [showBox, setShowBox] = useState(false);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box
      className={styles.searchbar}
      onFocus={() => setShowBox(true)}
      onBlur={() => setTimeout(() => setShowBox(false), 200)}
    >
      <form className={styles.container} onSubmit={submitHandler}>
        <IoSearch className={styles.icon} />
        <Input variant="unstyled" className={styles.input} placeholder="Search Twitter" />
      </form>
      <Box className={styles.box} data-show={showBox}>
        <Box className={styles['box-header']}>
          <Text className={styles['box-heading']}>Recent</Text>
          <Button variant="link" className={styles['box-button']}>
            Clear all
          </Button>
        </Box>
        <Box className={styles['box-content']}>
          <Text className={styles['box-placeholder']}>
            Try searching for people, topics, or keywords
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
export default Searchbar;
