import { Box } from '@chakra-ui/react';
import { IoLogoTwitter } from 'react-icons/io5';
import styles from './TwitterLoading.module.css';

const TwitterLoading = () => {
  return (
    <Box className={styles.container}>
      <IoLogoTwitter className={styles.logo} />
    </Box>
  );
};
export default TwitterLoading;
