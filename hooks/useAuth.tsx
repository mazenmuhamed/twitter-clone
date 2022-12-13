/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect, ReactNode, createContext } from 'react';
import { useRouter } from 'next/router';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { auth, db, provider, storage } from '../firebase';

interface IAuth {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  signInWithGoogle: () => void;
  logout: () => void;
  updateUserProfile: (name?: string, photoURL?: string) => Promise<void>;
  followUser: (user: DocumentData | undefined) => Promise<void>;
  unFollowUser: (user: DocumentData | undefined) => Promise<void>;
}

const AuthContext = createContext<IAuth>({
  user: null,
  loading: false,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  followUser: async () => {},
  unFollowUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.replace('/');
      }
      setAppLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sign in
  const signIn = (email: string, password: string) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(credential => {
        setUser(credential.user);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Sign up
  const signUp = (name: string, email: string, password: string) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(credential => {
        // Add avatar placeholder
        updateProfile(credential.user, {
          displayName: name,
          photoURL: `https://iili.io/HCchknj.png`,
        }).then(() => {
          // Save user with other users in firestore
          setDoc(doc(db, 'users', credential.user.uid), {
            uid: credential.user.uid,
            displayName: name,
            email: credential.user.email,
            username: credential.user?.email?.split('@')[0],
            photoURL: credential.user.photoURL,
            followers: [],
            following: [],
          });
        });
        setUser(credential.user);
        setError(null);
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  };

  // Sign in with google
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async result => {
        setUser(result.user);
        // Save user with other users in firestore
        const docRef = doc(db, 'users', result.user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return;
        setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user?.uid,
          displayName: result.user?.displayName,
          email: result.user?.email,
          username: result.user?.email?.split('@')[0],
          photoURL: result.user?.photoURL,
          followers: [],
          following: [],
        });
      })
      .catch(error => setError(error.message));
  };

  // Logout
  const logout = () => signOut(auth);

  // Update user profile
  const updateUserProfile = async (name?: string, photoUrl?: string) => {
    if (!user) return;
    try {
      setLoading(true);
      if (name) {
        await updateProfile(user, { displayName: name });
        const querySnapShot = await getDocs(collection(db, 'tweets'));
        querySnapShot.docs.map(async doc => {
          if (doc.data().uid !== user.uid) return;
          await updateDoc(doc.ref, { displayName: name });
          // Update user photo in comments
          const commentsQuerySnapShot = await getDocs(collection(db, 'tweets', doc.id, 'comments'));
          commentsQuerySnapShot.docs.map(async commentDoc => {
            if (commentDoc.data().uid !== user.uid) return;
            await updateDoc(commentDoc.ref, { displayName: name });
          });
        });
      }
      if (!photoUrl) return;
      // Upload image to storage
      const imageRef = ref(storage, `user/${user.uid}`);
      await uploadString(imageRef, photoUrl, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);
      await updateProfile(user, { photoURL: downloadURL });
      // Update user in user's document
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { photoURL: downloadURL }, { merge: true });
      // Update user photo in tweets
      const querySnapShot = await getDocs(collection(db, 'tweets'));
      querySnapShot.docs.map(async doc => {
        if (doc.data().uid === user.uid) {
          await updateDoc(doc.ref, { photoURL: downloadURL });
          await updateDoc(doc.ref, { displayName: name });
        }
        // Update user photo in comments
        const commentsQuerySnapShot = await getDocs(collection(db, 'tweets', doc.id, 'comments'));
        commentsQuerySnapShot.docs.map(async commentDoc => {
          if (commentDoc.data().uid === user.uid) {
            await updateDoc(commentDoc.ref, { photoURL: downloadURL });
            await updateDoc(commentDoc.ref, { displayName: name });
          }
        });
      });
      setLoading(false);
    } catch (error) {
      const { message } = error as Error;
      setError(message);
    }
  };

  // Follow user
  const followUser = async (u: DocumentData | undefined) => {
    if (!user || !u) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        following: arrayUnion({
          uid: u.uid,
          displayName: u.displayName,
          photoURL: u.photoURL,
          email: u.email,
          username: u.email?.split('@')[0],
        }),
      });
      const userDocRef = doc(db, 'users', u.uid);
      await updateDoc(userDocRef, {
        followers: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          username: user.email?.split('@')[0],
        }),
      });
    } catch (error) {
      const { message } = error as Error;
      setError(message);
    }
    setLoading(false);
  };

  const unFollowUser = async (u: DocumentData | undefined) => {
    if (!user || !u) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        following: arrayRemove({
          uid: u.uid,
          displayName: u.displayName,
          photoURL: u.photoURL,
          email: u.email,
          username: u.email?.split('@')[0],
        }),
      });
      const userDocRef = doc(db, 'users', u.uid);
      await updateDoc(userDocRef, {
        followers: arrayRemove({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          username: user.email?.split('@')[0],
        }),
      });
    } catch (error) {
      const { message } = error as Error;
      setError(message);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        updateUserProfile,
        followUser,
        unFollowUser,
      }}
    >
      {!appLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
