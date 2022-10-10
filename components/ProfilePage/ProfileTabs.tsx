import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { DocumentData } from 'firebase/firestore';

import { Tweet as TweetData } from '../../types';
import Tweet from '../HomePage/Feed/Tweet';
import styles from './ProfileTabs.module.css';

const tabs = ['Tweets', 'Tweets & replies', 'Media', 'Likes'];

type Props = {
  tweets: DocumentData[] | TweetData[];
};

const ProfileTabs = ({ tweets }: Props) => {
  return (
    <Tabs isLazy={true} isFitted={true} className={styles.tabs}>
      <TabList className={styles.list}>
        {tabs.map((tab, index) => (
          <Tab key={index} className={styles.tab}>
            {tab}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        <TabPanel padding="0">
          {tweets.map(tweet => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProfileTabs;
