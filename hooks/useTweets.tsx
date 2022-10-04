import { useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Tweet } from '../types';
import useAuth from './useAuth';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const useTweets = () => {
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const [tweets, setTweets] = useState<DocumentData[] | Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');

  const { user } = useAuth();

  const addTweet = async (text: string, image?: string) => {
    if (!user || loading) return;
    setLoading(true);
    // Upload tweet to firestore
    const docRef = await addDoc(collection(db, 'tweets'), {
      uid: user?.uid,
      displayName: user.displayName,
      username: user.email?.slice(0, user.email.indexOf('@')),
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

  return { loading, error, addTweet };
};
export default useTweets;
