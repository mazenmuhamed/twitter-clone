/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Highlight, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { IoLogoTwitter, IoLogoApple } from 'react-icons/io5';
import Head from 'next/head';
import Image from 'next/image';

import useAuth from '../hooks/useAuth';
import styles from '../styles/Login.module.css';
import SignUpFormModal from '../components/LoginPage/SignUpFormModal';
import SignInFormModal from '../components/LoginPage/SignInFormModal';
import TwitterLoading from '../components/UI/TwitterLoading';

const Login = () => {
  const { user, signInWithGoogle } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/home');
  }, [user]);

  if (user) return <TwitterLoading />;

  return (
    <>
      <Head>
        <title>Twitter. It’s what’s happening / Twitter</title>
      </Head>

      <main className={styles.page}>
        <section className={styles.cover}>
          <IoLogoTwitter className={styles['cover-logo']} />
        </section>
        <section className={styles.container}>
          <Box>
            <IoLogoTwitter className={styles['container-logo']} />
          </Box>
          <h1 className={styles['container-title']}>Happening now</h1>
          <h2 className={styles['container-subtitle']}>Join Twitter today.</h2>
          <Box className={styles.buttons}>
            {/* Google button */}
            <button className={styles['button']} onClick={signInWithGoogle}>
              <Image
                src={require('/public/icons/google.svg')}
                alt="Google"
                width={22}
                height={22}
              />
              <span className={styles['button-text']}>Sign in with Google</span>
            </button>
            {/* Apple button */}
            <button className={styles['button']}>
              <IoLogoApple className={styles['button-icon']} />
              <span className={styles['button-text']} data-icon="apple">
                Sign in with Apple
              </span>
            </button>
          </Box>
          <Box className={styles.separetor}>
            <Box w="70%" h="1px" bg="gray.200" />
            <Text fontSize="2xl" mx="4">
              or
            </Text>
            <Box w="70%" h="1px" bg="gray.200" />
          </Box>
          <button className={styles['button']} data-type="solid" onClick={onOpen}>
            <span className={styles['button-text']}>Sign up with email address</span>
          </button>
          <Text className={styles['container-text']}>
            <Highlight
              query={['Terms of Service', 'Privacy Policy', 'Cookie Use']}
              styles={{
                color: 'blue.400',
                cursor: 'pointer',
                _hover: { textDecoration: 'underline' },
              }}
            >
              By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie
              Use.
            </Highlight>
          </Text>
          <Spacer />
          <Box className={styles['container-singin']}>
            <Text className={styles['container-signin-title']}>Aleady have an account?</Text>
            <button className={styles['button']} data-hover="blue" onClick={onModalOpen}>
              <span className={styles['button-text']}>Sign in</span>
            </button>
          </Box>
        </section>
      </main>
      {/* Modals */}
      <SignUpFormModal isOpen={isOpen} onClose={onClose} />
      <SignInFormModal isOpen={isModalOpen} onClose={onModalClose} />
    </>
  );
};

export default Login;
