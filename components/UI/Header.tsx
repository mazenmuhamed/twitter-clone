import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import styles from './Header.module.css';

const Header = ({ children }: { children: ReactNode }) => {
  return <Box className={styles.container}>{children}</Box>;
};
export default Header;
