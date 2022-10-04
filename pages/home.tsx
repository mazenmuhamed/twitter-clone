import Head from 'next/head';

import Navbar from '../components/Navbar';
import Feed from '../components/HomePage/Feed';
import Widgets from '../components/Widgets';
import styles from '../styles/Home.module.css';
import useAuth from '../hooks/useAuth';

const Home = () => {
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
          <Widgets />
        </section>
      </main>
    </>
  );
};
export default Home;
