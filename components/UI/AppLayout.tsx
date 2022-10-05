import { ReactNode } from 'react';

import Navbar from '../Navbar';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.container}>{children}</section>
    </main>
  );
};
export default AppLayout;
