import { Timestamp } from 'firebase/firestore';

interface IData {
  uid: string;
  id: string;
  displayName: string;
  username: string;
  photoURL: string;
  text: string;
  image?: string;
  createdAt: Timestamp;
}

export interface Tweet extends IData {}

export interface Comment extends IData {
  replyTo: string;
}

export type Artical = {
  heading: string;
  description: string;
  photo: string;
  tag: string;
};
