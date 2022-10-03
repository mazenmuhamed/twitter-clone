/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext,
  useState,
  useEffect,
  ReactNode,
  createContext,
} from 'react';
import { useRouter } from 'next/router';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, provider } from '../firebase';

interface IAuth {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  signInWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<IAuth>({
  user: null,
  loading: false,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
          photoURL: `https://scontent.fcai21-4.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=7206a8&_nc_ohc=jvAgaOmK2RAAX_C1VOX&_nc_ht=scontent.fcai21-4.fna&oh=00_AT8UMjq-IkxcIrWzP7Ep9HQ1twyvG4vUcz-8XggW0sVtoQ&oe=633D2A78`,
        }).then(() => {
          // Save user with other users in firestore
          setDoc(doc(db, 'users', credential.user.uid), {
            uid: credential.user.uid,
            displayName: name,
            email: credential.user.email,
            photoURL: credential.user.photoURL,
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
      .then(result => {
        setUser(result.user);
        // Save user with other users in firestore
        setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user?.uid,
          displayName: result.user?.displayName,
          email: result.user?.email,
          photoUrl: result.user?.photoURL,
        });
      })
      .catch(error => setError(error.message));
  };

  // Logout
  const logout = () => {};

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
      }}
    >
      {!appLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
