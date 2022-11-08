import { Box, Tooltip } from '@chakra-ui/react';
import { IoChevronUpOutline, IoMailOutline } from 'react-icons/io5';
import styles from './MessageBox.module.css';

const MessageBox = () => {
  return (
    // TODO: Add expand/collapse functionality
    <Box className={styles.container}>
      <p className={styles.title}>Messages</p>
      <Box className={styles.icons}>
        <Tooltip className="tooltip" label="New message" mb="-0.5rem">
          <Box className={styles.icon}>
            <IoMailOutline />
          </Box>
        </Tooltip>
        <Tooltip className="tooltip" label="Expand" mb="-0.5rem">
          <Box className={styles.icon}>
            <IoChevronUpOutline />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
export default MessageBox;
