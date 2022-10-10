import { useContext, useLayoutEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { AppContext } from '../store/AppContext';
import AppLayout from '../components/UI/AppLayout';
import Widgets from '../components/Widgets';
import useAuth from '../hooks/useAuth';
import Wall from '../components/ProfilePage/Wall';

type Props = {
  trending: any[];
  users: any[];
};

const Profile = ({ trending, users }: Props) => {
  const { user } = useAuth();
  const { setActiveNavIndex } = useContext(AppContext);

  useLayoutEffect(() => setActiveNavIndex(6), [setActiveNavIndex]);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>
          {user?.displayName} (@{user?.email?.split('@')[0]}) / Twitter
        </title>
      </Head>

      <AppLayout>
        <Wall />
        <Widgets trending={trending} users={users} />
      </AppLayout>
    </>
  );
};
export default Profile;

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetch('https://twitter-clone-f1ea1-default-rtdb.firebaseio.com/widgets.json');
  const widgets = await data.json();

  const trending = widgets.trending;
  const users = widgets.users;

  return {
    props: { trending, users },
  };
};
