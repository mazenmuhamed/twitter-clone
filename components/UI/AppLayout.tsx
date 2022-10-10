import { ReactNode } from 'react';

import useAuth from '../../hooks/useAuth';
import Navbar from '../Navbar';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.container}>{children}</section>
    </main>
  );
};
export default AppLayout;
