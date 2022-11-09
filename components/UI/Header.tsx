import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import styles from './Header.module.css';

type Props = {
  children: ReactNode;
  className?: string;
};

const Header = ({ children, className }: Props) => {
  return <Box className={`${styles.container} ${className}`}>{children}</Box>;
};
export default Header;
