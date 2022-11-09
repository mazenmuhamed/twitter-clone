import { Tab, TabList, Tabs } from '@chakra-ui/react';
import styles from './AppTabList.module.css';

type Props = {
  tabs: string[];
  tabsClassName?: string;
};

const AppTabList = ({ tabs, tabsClassName }: Props) => {
  return (
    <Tabs isLazy={true} isFitted={true} className={tabsClassName}>
      <TabList className={styles.list}>
        {tabs.map((tab, index) => (
          <Tab key={index} className={styles.tab}>
            {tab}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};
export default AppTabList;
