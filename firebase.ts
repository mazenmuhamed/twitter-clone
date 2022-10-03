import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDSxFZ2r9LAixHpYjknRwp8GRN2JjAFPGY',
  authDomain: 'twitter-clone-f1ea1.firebaseapp.com',
  projectId: 'twitter-clone-f1ea1',
  storageBucket: 'twitter-clone-f1ea1.appspot.com',
  messagingSenderId: '455712971370',
  appId: '1:455712971370:web:71edcf93d3dcd12ced4813',
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth();
export const db = getFirestore();

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export default app;
