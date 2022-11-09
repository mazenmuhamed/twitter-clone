import { Box, Spinner } from '@chakra-ui/react';
import { IoSettingsOutline } from 'react-icons/io5';
import { Artical } from '../../types';
import { Trend } from '../Widgets/Widgets';
import useSWR from 'swr';
import AppTabList from '../UI/AppTabList';
import Header from '../UI/Header';
import Searchbar from '../Widgets/Searchbar';
import TrendBanner from './TrendBanner';
import styles from './Wall.module.css';

const URL = 'https://twitter-clone-f1ea1-default-rtdb.firebaseio.com/widgets.json';
const tabs = ['For you', 'Trending', 'News', 'Sports', 'Movies'];

const randomNumber = Math.floor(Math.random() * 3);
const fetcher = (url: string) => fetch(url).then(res => res.json());

const Wall = () => {
  const { data } = useSWR(URL, fetcher);
  const randomAritcal = data?.trending[randomNumber];

  return (
    <div className="container">
      <Header className={styles.header}>
        <Box className={styles.container}>
          <Box className={styles['search-container']}>
            <Searchbar className={styles.searchbar} />
            <Box className={styles.icon}>
              <IoSettingsOutline />
            </Box>
          </Box>
          <AppTabList tabs={tabs} />
        </Box>
      </Header>
      {!data && (
        <Box className="spinner">
          <Spinner size="xl" thickness="3px" emptyColor="#1d9bf01a" color="#1d9bf0" />
        </Box>
      )}
      {data && (
        <Box className={styles['trends-container']} p={0}>
          {!randomAritcal ? (
            <Box className="spinner">
              <Spinner size="xl" thickness="3px" emptyColor="#1d9bf01a" color="#1d9bf0" />
            </Box>
          ) : (
            <TrendBanner artical={randomAritcal} />
          )}
          {data.trending.map((artical: Artical, index: number) => {
            if (index === randomNumber) return null;
            return <Trend key={index} trend={artical} />;
          })}
        </Box>
      )}
    </div>
  );
};
export default Wall;
