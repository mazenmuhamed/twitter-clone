import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { collection, DocumentData, getDocs } from 'firebase/firestore';
import Head from 'next/head';

import { AppContext } from '../store/AppContext';
import AppLayout from '../components/UI/AppLayout';
import Widgets from '../components/Widgets';
import useAuth from '../hooks/useAuth';
import Wall from '../components/ProfilePage/Wall';
import { db } from '../firebase';

type Props = {
  trending: any[];
  users: any[];
};

const Profile = ({ trending, users }: Props) => {
  const [searchedUser, setSearchedUser] = useState<DocumentData>();
  const { setActiveNavIndex } = useContext(AppContext);

  const { user } = useAuth();
  const currentUserUsername = user?.email?.split('@')[0];

  const router = useRouter();
  const { username } = router.query;

  // Get the searched user from the users collection
  useEffect(() => {
    const getUser = async () => {
      if (currentUserUsername === username) return null;
      const querySnapshot = await getDocs(collection(db, 'users'));
      const u = querySnapshot.docs.find(doc => doc.data().username === username);
      setSearchedUser(u?.data());
    };
    getUser();
  }, [currentUserUsername, username]);

  useLayoutEffect(
    () => setActiveNavIndex(currentUserUsername === username ? 6 : undefined),
    [currentUserUsername, setActiveNavIndex, username]
  );

  if (!user) return null;

  // Searched user's profile
  if (currentUserUsername !== username) {
    if (!searchedUser) return null;

    return (
      <>
        <Head>
          <title>
            {searchedUser?.displayName} (@{searchedUser?.username}) / Twitter
          </title>
        </Head>

        <AppLayout>
          <Wall user={searchedUser} />
          <Widgets trending={trending} users={users} />
        </AppLayout>
      </>
    );
  }

  // Current user's profile page
  return (
    <>
      <Head>
        <title>
          {user?.displayName} (@{currentUserUsername}) / Twitter
        </title>
      </Head>

      <AppLayout>
        <Wall user={user} />
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
