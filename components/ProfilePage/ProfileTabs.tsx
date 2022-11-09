import { TabPanel, TabPanels } from '@chakra-ui/react';
import { DocumentData } from 'firebase/firestore';

import { Tweet as TweetData } from '../../types';
import Tweet from '../HomePage/Feed/Tweet';
import AppTabList from '../UI/AppTabList';
import styles from './ProfileTabs.module.css';

const tabs = ['Tweets', 'Tweets & replies', 'Media', 'Likes'];

type Props = {
  tweets: DocumentData[] | TweetData[];
};

const ProfileTabs = ({ tweets }: Props) => {
  return (
    <AppTabList tabs={tabs} tabsClassName={styles.tabs}>
      <TabPanels>
        <TabPanel padding="0">
          {tweets.map(tweet => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </TabPanel>
      </TabPanels>
    </AppTabList>
  );
};

export default ProfileTabs;
