import { MouseEvent } from 'react';
import { Box, Menu, MenuButton, MenuList, MenuItem, Portal } from '@chakra-ui/react';
import { IoEllipsisHorizontal, IoSadOutline, IoTrashBinOutline } from 'react-icons/io5';

import menu from './menu';
import useAuth from '../../../hooks/useAuth';
import styles from './TweetMenu.module.css';

type Props = {
  uid: string;
  onDelete: VoidFunction;
};

const TweetMenu = ({ uid, onDelete }: Props) => {
  const { user } = useAuth();

  const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <Menu placement="bottom-end" autoSelect={false}>
      <MenuButton as={Box} className={styles.menu} onClick={clickHandler}>
        <IoEllipsisHorizontal />
      </MenuButton>
      <Portal>
        <MenuList className={styles['menu-list']}>
          {user?.uid === uid ? (
            <MenuItem className={styles['menu-item']} data-type="delete" onClick={onDelete}>
              <IoTrashBinOutline className={styles['menu-icon']} />
              <span className={styles['menu-label']}>Delete</span>
            </MenuItem>
          ) : (
            <MenuItem className={styles['menu-item']}>
              <IoSadOutline className={styles['menu-icon']} />
              <span className={styles['menu-label']}>Not interested in this Tweet</span>
            </MenuItem>
          )}
          {menu.map(({ Icon, label }, idx) => (
            <MenuItem key={idx} className={styles['menu-item']}>
              <Icon className={styles['menu-icon']} />
              <span className={styles['menu-label']}>{label}</span>
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};
export default TweetMenu;
