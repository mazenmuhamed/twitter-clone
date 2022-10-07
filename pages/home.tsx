import { useContext, useLayoutEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { AppContext } from '../store/AppContext';
import Feed from '../components/HomePage/Feed';
import Widgets from '../components/Widgets';
import useAuth from '../hooks/useAuth';
import AppLayout from '../components/UI/AppLayout';

type Props = {
  trending: any[];
  users: any[];
};

const Home = ({ trending, users }: Props) => {
  const { setActiveNavIndex } = useContext(AppContext);
  const { user } = useAuth();

  useLayoutEffect(() => setActiveNavIndex(0), [setActiveNavIndex]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Home / Twitter</title>
      </Head>

      <AppLayout>
        <Feed />
        <Widgets trending={trending} users={users} />
      </AppLayout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetch('https://twitter-clone-f1ea1-default-rtdb.firebaseio.com/widgets.json');
  const widgets = await data.json();

  const trending = widgets.trending;
  const users = widgets.users;

  return {
    props: { trending, users },
  };
};
