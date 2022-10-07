import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, List, ListItem, Spacer, useDisclosure } from '@chakra-ui/react';
import { IoLogoTwitter } from 'react-icons/io5';
import Image from 'next/image';

import tabs from './tabs';
import useAuth from '../../hooks/useAuth';
import styles from './Navbar.module.css';
import AddTweetModal from './AddTweetModal';
import UserAvatar from '../UI/UserAvatar';

const Navbar = () => {
  const router = useRouter();

  const [active, setActive] = useState(router.pathname === '/home' && 0);

  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const username = user?.email?.slice(0, user.email.indexOf('@'));

  return (
    <header className={styles.header}>
      <Box className={styles.container}>
        <Box
          className={[styles.logo, styles.hover].join(' ')}
          onClick={() => router.push('/home')}
          data-bg="blue"
        >
          <IoLogoTwitter />
        </Box>
        {/* Tabs */}
        <List className={styles.list}>
          {tabs.map(({ title, icon, activeIcon, path }, index) => (
            <ListItem
              key={title}
              onClick={() => {
                setActive(index);
                if (path) router.push(path);
                else router.push('/' + username);
              }}
              className={[styles['list-item'], styles.hover].join(' ')}
            >
              {active === index ? (
                <Image src={activeIcon} alt={title} width={27} height={27} />
              ) : (
                <Image src={icon} alt={title} width={27} height={27} />
              )}
              <span className={styles['list-item-title']} data-active={active === index}>
                {title}
              </span>
            </ListItem>
          ))}
          <ListItem className={[styles['list-item'], styles.hover].join(' ')}>
            <Image
              src={require('/public/icons/more-cricle.svg')}
              alt="More"
              width={28}
              height={28}
            />
            <span className={styles['list-item-title']}>More</span>
          </ListItem>
          {/* Add tweet button */}
          <ListItem as={Button} className={styles['list-button']} onClick={onOpen}>
            Tweet
          </ListItem>
        </List>
        <Spacer />
        {/* User button */}
        <Box className={[styles.box, styles.hover].join(' ')} onClick={logout}>
          <UserAvatar />
          <Box className={styles['box-names']}>
            <span className={styles['box-name']}>{user?.displayName || ''}</span>
            <span className={styles['box-username']}>@{username}</span>
          </Box>
          <Image src={require('/public/icons/more.svg')} alt="More" width={20} height={20} />
        </Box>
      </Box>
      {/* Modal */}
      <AddTweetModal isOpen={isOpen} onClose={onClose} />
    </header>
  );
};
export default Navbar;
