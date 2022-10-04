interface IData {
  uid: string;
  id: string;
  displayName: string;
  username: string;
  photoURL: string;
  text: string;
  image?: string;
  createdAt: string;
}

export interface Tweet extends IData {}

export interface Comment extends IData {
  replyTo: string;
}
