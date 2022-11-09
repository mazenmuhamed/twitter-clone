import { Box, Highlight } from '@chakra-ui/react';
import { Artical } from '../../types';
import Image from 'next/image';
import styles from './TrendBanner.module.css';

type Props = {
  artical: Artical;
};

const TrendBanner = ({ artical }: Props) => {
  const regex = /(#|@)(\w+)/g;
  const hashtags = artical.description.match(regex);

  return (
    <Box className={styles.banner}>
      <Image src={artical.photo} alt="Picture of the author" layout="fill" objectFit="cover" />
      <Box className={styles['banner-content']}>
        <h3 className={styles.title}>
          <span>{artical.heading}</span>
          <span>{artical.tag}</span>
        </h3>
        <h1 className={styles.description}>
          <Highlight query={hashtags || ''} styles={{ color: '#1d9bf0' }}>
            {artical.description}
          </Highlight>
        </h1>
      </Box>
    </Box>
  );
};

export default TrendBanner;
