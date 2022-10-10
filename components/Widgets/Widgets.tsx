import { Box, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';

import FooterLinks from './FooterLinks';
import Searchbar from './Searchbar';
import styles from './Widgets.module.css';

type TrendProps = {
  trend: any;
};

const Trend = ({ trend }: TrendProps) => {
  return (
    <Box className={styles.trend}>
      <Text className={styles['trend-tag']}>{trend.tag}</Text>
      <Box className={styles['trend-content']}>
        <Text className={styles['trend-content-desc']}>{trend.description}</Text>
        <Box className={styles['trend-content-image']}>
          <Image
            src={trend.photo}
            alt={trend.description}
            layout="fill"
            objectFit="cover"
            quality={50}
          />
        </Box>
      </Box>
    </Box>
  );
};

type UserProps = {
  user: any;
};

const User = ({ user }: UserProps) => {
  return (
    <Box className={styles.user}>
      <Box className={styles['user-left']}>
        <Box className={styles.photo}>
          <Image src={user.photoURL} alt={user.tag} layout="fill" objectFit="cover" quality={50} />
        </Box>
        <Box className={styles['user-info']}>
          <Text className={styles['user-info-name']}>{user.username}</Text>
          <Text className={styles['user-info-tag']}>{user.tag}</Text>
        </Box>
      </Box>
      {/* TODO: Follow functionality */}
      <Button className={styles['user-button']}>Follow</Button>
    </Box>
  );
};

type Props = {
  trending?: any[];
  users?: any[];
};

const Widgets = ({ trending, users }: Props) => {
  return (
    <Box className={styles.container}>
      <Box className={styles['container-box']}>
        <Searchbar />
        <Box className={styles.widgets} data-position={trending && users ? true : false}>
          {trending && (
            <Box className={styles.box}>
              <Text className={styles['box-heading']}>What’s happening</Text>
              {trending.map((trend, idx) => (
                <Trend key={idx} trend={trend} />
              ))}
              <Button variant="link" className={styles.link}>
                See more
              </Button>
            </Box>
          )}
          {users && (
            <Box className={styles.box}>
              <Text className={styles['box-heading']}>Who to follow</Text>
              {users.map((user, idx) => (
                <User key={idx} user={user} />
              ))}
              <Button variant="link" className={styles.link}>
                See more
              </Button>
            </Box>
          )}
          <FooterLinks />
        </Box>
      </Box>
    </Box>
  );
};
export default Widgets;
