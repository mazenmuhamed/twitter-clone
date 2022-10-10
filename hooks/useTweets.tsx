import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
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
import { Comment, Tweet } from '../types';
import useAuth from './useAuth';

const useTweets = (id?: string, commentId?: string) => {
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const [tweets, setTweets] = useState<DocumentData[] | Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');

  // Actions
  const [likes, setLikes] = useState<DocumentData[]>([]);
  const [liked, setLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState<DocumentData[]>([]);
  const [commentLiked, setCommentLiked] = useState(false);
  const [comments, setComments] = useState<DocumentData[] | Comment[]>([]);
  const [actionsLoading, setActionsLoading] = useState(true);

  const { user } = useAuth();

  // Get all tweets
  useEffect(
    () =>
      onSnapshot(query(collection(db, 'tweets'), orderBy('createdAt', 'desc')), snapshot => {
        setTweets(snapshot.docs.map(doc => doc.data()));
        setTweetsLoading(false);
      }),
    [user?.uid]
  );

  useEffect(() => {
    if (!id || !user) return;
    const unsubscribe = () => {
      // Get likes
      onSnapshot(collection(db, 'tweets', id, 'likes'), snapshot => {
        setLikes(snapshot.docs.map(doc => doc.data()));
        setLiked(snapshot.docs.some(doc => doc.data().uid === user.uid));
      });
      // Get comments
      onSnapshot(
        query(collection(db, 'tweets', id, 'comments'), orderBy('createdAt', 'desc')),
        snapshot => {
          setComments(snapshot.docs.map(doc => doc.data()));
        }
      );
      setActionsLoading(false);
    };
    unsubscribe();
  }, [id, user]);

  // Comments actions
  useEffect(() => {
    if (!id || !user || !commentId) return;
    const unsubscribe = () => {
      // Get likes
      onSnapshot(collection(db, 'tweets', id, 'comments', commentId, 'likes'), snapshot => {
        setCommentLikes(snapshot.docs.map(doc => doc.data()));
        setCommentLiked(snapshot.docs.some(doc => doc.data().uid === user.uid));
      });
      // Get comments
      onSnapshot(
        query(
          collection(db, 'tweets', id, 'comments', commentId, 'comments'),
          orderBy('createdAt', 'desc')
        ),
        snapshot => {
          setComments(snapshot.docs.map(doc => doc.data()));
        }
      );
      setActionsLoading(false);
    };
    unsubscribe();
  }, [commentId, id, user]);

  // Create tweet
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
    if (!image) {
      setLoading(false);
      return;
    }
    // Upload image to storage
    const imageRef = ref(storage, `tweets/${docRef.id}`);
    await uploadString(imageRef, image, 'data_url')
      .then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, 'tweets', docRef.id), { image: downloadURL });
      })
      .catch(err => setError(err.message));
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

  // Like tweet
  const addLike = (tweetId: string) => {
    if (!user) return;
    // Check if user has liked tweet
    if (liked) {
      deleteDoc(doc(db, 'tweets', tweetId, 'likes', user.uid));
    } else {
      setDoc(doc(db, 'tweets', tweetId, 'likes', user.uid), {
        uid: user.uid,
        username: user.email?.split('@')[0],
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
  };

  // Like comment
  const addLikeComment = (tweetId: string, commentId: string) => {
    if (!user) return;
    // Check if user has liked comment
    if (commentLiked) {
      deleteDoc(doc(db, 'tweets', tweetId, 'comments', commentId, 'likes', user.uid));
    } else {
      setDoc(doc(db, 'tweets', tweetId, 'comments', commentId, 'likes', user.uid), {
        uid: user.uid,
        username: user.email?.split('@')[0],
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
  };

  return {
    tweetsLoading,
    actionsLoading,
    tweets,
    loading,
    error,
    liked,
    likes,
    comments,
    commentLikes,
    commentLiked,
    addLike,
    addTweet,
    addReply,
    addLikeComment,
  };
};
export default useTweets;
