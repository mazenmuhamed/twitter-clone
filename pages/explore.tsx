import { GetServerSideProps } from 'next';
import { useContext, useLayoutEffect } from 'react';
import { AppContext } from '../store/AppContext';
import Head from 'next/head';
import Wall from '../components/ExplorePage/Wall';
import AppLayout from '../components/UI/AppLayout';
import Widgets from '../components/Widgets';

const ExplorePage = ({ users }: { users: any }) => {
  const { setActiveNavIndex } = useContext(AppContext);

  useLayoutEffect(() => setActiveNavIndex(1), [setActiveNavIndex]);

  return (
    <>
      <Head>
        <title>Explore / Twitter</title>
      </Head>
      <AppLayout>
        <Wall />
        <Widgets users={users} />
      </AppLayout>
    </>
  );
};
export default ExplorePage;

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetch('https://twitter-clone-f1ea1-default-rtdb.firebaseio.com/widgets.json');
  const widgets = await data.json();

  const users = widgets.users;

  return {
    props: { users: users },
  };
};
