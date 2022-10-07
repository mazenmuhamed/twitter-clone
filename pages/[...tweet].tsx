import { useContext, useLayoutEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import Head from 'next/head';

import { AppContext } from '../store/AppContext';
import { db } from '../firebase';
import { Tweet as TweetData } from '../types';
import AppLayout from '../components/UI/AppLayout';
import Widgets from '../components/Widgets';
import Tweet from '../components/TweetPage/Tweet';

type Props = {
  tweet: any;
  trending: any[];
};

const TweetPage = ({ tweet, trending }: Props) => {
  const { setActiveNavIndex } = useContext(AppContext);

  useLayoutEffect(() => setActiveNavIndex(undefined), [setActiveNavIndex]);

  const currentTweet: TweetData = JSON.parse(tweet);

  return (
    <>
      <Head>
        <title>
          {currentTweet.displayName} on Twitter: &quot;{currentTweet.text}&quot;
        </title>
      </Head>

      <AppLayout>
        <Tweet tweet={currentTweet} />
        <Widgets trending={trending} />
      </AppLayout>
    </>
  );
};
export default TweetPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { tweet } = context.query;

  if (!tweet) return { notFound: true };

  // Get tweet
  const docRef = doc(db, 'tweets', tweet[1].toString());
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return { notFound: true };

  // Get widgets
  const data = await fetch('https://twitter-clone-f1ea1-default-rtdb.firebaseio.com/widgets.json');
  const widgets = await data.json();

  const trending = widgets.trending;

  return {
    props: {
      tweet: JSON.stringify(docSnap.data()),
      trending: trending,
    },
  };
};
