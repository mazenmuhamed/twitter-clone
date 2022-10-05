import { GetServerSideProps } from 'next';
import Head from 'next/head';

import Navbar from '../components/Navbar';
import Feed from '../components/HomePage/Feed';
import Widgets from '../components/Widgets';
import styles from '../styles/Home.module.css';
import useAuth from '../hooks/useAuth';

type Props = {
  trending: any[];
  users: any[];
};

const Home = ({ trending, users }: Props) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Home / Twitter</title>
      </Head>

      <main className={styles.page}>
        <Navbar />
        <section className={styles.container}>
          <Feed />
          <Widgets trending={trending} users={users} />
        </section>
      </main>
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
