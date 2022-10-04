import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

import { db, storage } from '../firebase';
import { Tweet } from '../types';
import useAuth from './useAuth';

const useTweets = () => {
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const [tweets, setTweets] = useState<DocumentData[] | Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');

  const { user } = useAuth();

  // Get all tweets
  useEffect(
    () =>
      onSnapshot(query(collection(db, 'tweets'), orderBy('createdAt', 'desc')), snapshot => {
        setTweets(snapshot.docs.map(doc => doc.data()));
        setTweetsLoading(false);
      }),
    []
  );

  const addTweet = async (text: string, image?: string) => {
    if (!user || loading) return;
    setLoading(true);
    // Upload tweet to firestore
    const docRef = await addDoc(collection(db, 'tweets'), {
      uid: user?.uid,
      displayName: user.displayName,
      username: user.email?.split('@')[0],
      photoURL: user.photoURL,
      text: text,
      createdAt: serverTimestamp(),
    });
    // Add doc id to tweet
    const tweetDoc = doc(db, 'tweets', docRef.id);
    await setDoc(tweetDoc, { id: docRef.id }, { merge: true });
    // If there is an image
    if (image) {
      // Upload image to storage
      const imageRef = ref(storage, `tweets/${docRef.id}`);
      await uploadString(imageRef, image, 'data_url')
        .then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, 'tweets', docRef.id), { image: downloadURL });
        })
        .catch(err => setError(err.message));
    }
    // Reset values
    setLoading(false);
    setError(null);
  };

  // Add reply to tweet
  const addReply = async (text: string, tweetId: string, replyTo: string, image?: string) => {
    if (!user || loading) return;
    setLoading(true);
    // Upload comment to firestore
    const docRef = await addDoc(collection(db, 'tweets', tweetId, 'comments'), {
      uid: user.uid,
      displayName: user.displayName,
      username: user.email?.split('@')[0],
      photoURL: user.photoURL,
      text: text,
      replyTo: replyTo,
      createdAt: serverTimestamp(),
    });
    // Add doc id to comment
    const commenttDoc = doc(db, 'tweets', tweetId, 'comments', docRef.id);
    await setDoc(commenttDoc, { id: docRef.id }, { merge: true });
    // If there is an image
    if (image) {
      // Upload image to storage
      const imageRef = ref(storage, `comments/${docRef.id}`);
      await uploadString(imageRef, image, 'data_url')
        .then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, 'tweets', tweetId, 'comments', docRef.id), {
            image: downloadURL,
          });
        })
        .catch(err => setError(err.message));
    }
    // Reset values
    setLoading(false);
    setError(null);
  };

  return { tweetsLoading, tweets, loading, error, addTweet, addReply };
};
export default useTweets;
