import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline, IoLogoApple, IoLogoTwitter } from 'react-icons/io5';
import Image from 'next/image';

import useAuth from '../../hooks/useAuth';
import ModalLayout from '../UI/ModalLayout';
import styles from './SignInFormModal.module.css';

type FormData = {
  email: string;
  password: string;
};

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
};

const SignInFormModal = ({ isOpen, onClose }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, signIn, signInWithGoogle } = useAuth();
  const { register, handleSubmit, watch, formState } = useForm<FormData>();
  const { email, password } = watch();
  const { errors } = formState;

  const submitHandler = handleSubmit(data => {
    signIn(data.email, data.password);
  });

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <IoLogoTwitter className={styles.logo} />
      </ModalHeader>
      <ModalBody className={styles['modal-body']}>
        <h2 className={styles['modal-title']}>Sign in to Twitter</h2>
        <Box className={styles.buttons}>
          {/* Google button */}
          <button className={styles['button']} onClick={signInWithGoogle}>
            <Image src={require('/public/icons/google.svg')} alt="Google" width={22} height={22} />
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
        <form className={styles.form} onSubmit={submitHandler}>
          {/* Email input */}
          <FormControl
            className={styles['input-container']}
            data-invalid={
              errors.email?.type === 'required' ||
              errors.email?.type === 'pattern' ||
              error !== null
            }
          >
            <FormLabel
              className={styles['input-label']}
              data-valid={email?.length ? 'true' : 'false'}
            >
              Email
            </FormLabel>
            <Input
              variant="unstyled"
              className={styles.input}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </FormControl>
          <Text className={styles['input-error']}>{errors.email?.message || error}&nbsp;</Text>
          {/* Password input */}
          <FormControl
            className={styles['input-container']}
            data-invalid={
              errors.password?.type === 'required' ||
              errors.password?.type === 'minLength' ||
              error !== null
            }
          >
            <FormLabel
              className={styles['input-label']}
              data-valid={password?.length ? 'true' : 'false'}
            >
              Password
            </FormLabel>
            <Input
              variant="unstyled"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <Box
              className={styles['input-container-icon']}
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? (
                <IoEyeOffOutline className={styles['input-icon']} />
              ) : (
                <IoEyeOutline className={styles['input-icon']} />
              )}
            </Box>
          </FormControl>
          <Text className={styles['input-error']}>{errors.password?.message || error}&nbsp;</Text>
          <Button
            type="submit"
            disabled={!email || !password}
            isLoading={loading}
            className={styles['form-button']}
          >
            Sign in
          </Button>
          {/* TODO: Forget password */}
        </form>
        <button className={styles['button']} data-name="forgot">
          <span className={styles['button-text']}>Forgot password?</span>
        </button>
      </ModalBody>
    </ModalLayout>
  );
};

export default SignInFormModal;
