import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { ReactNode } from 'react';
import styles from './AppTabList.module.css';

type Props = {
  tabs: string[];
  tabsClassName?: string;
  children?: ReactNode;
};

const AppTabList = ({ tabs, tabsClassName, children }: Props) => {
  return (
    <Tabs isLazy={true} isFitted={true} className={tabsClassName}>
      <TabList className={styles.list}>
        {tabs.map((tab, index) => (
          <Tab key={index} className={styles.tab}>
            {tab}
          </Tab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
};
export default AppTabList;
