import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

import useAuth from '../../hooks/useAuth';
import ModalLayout from '../UI/ModalLayout';
import styles from './SignUpFormModal.module.css';

type FormData = {
  name: string;
  email: string;
  password: string;
};

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
};

const SignUpFormModal = ({ isOpen, onClose }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, signUp } = useAuth();
  const { register, handleSubmit, watch, formState } = useForm<FormData>();
  const { name, email, password } = watch();
  const { errors } = formState;

  const submitHandler = handleSubmit(data => {
    signUp(data.name, data.email, data.password);
  });

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <h3 className={styles['modal-steps']}>Step 1 of 1</h3>
      </ModalHeader>
      <ModalBody className={styles['modal-body']}>
        <form className={styles.form} onSubmit={submitHandler}>
          <h2 className={styles['form-title']}>Create your account</h2>
          {/* Name input */}
          <FormControl
            className={styles['input-container']}
            isInvalid={!!errors.name}
            data-invalid={
              errors.name?.type === 'required' ||
              errors.name?.type === 'minLength' ||
              errors.name?.type === 'maxLength'
            }
          >
            <FormLabel
              className={styles['input-label']}
              data-valid={name?.length ? 'true' : 'false'}
            >
              Name
            </FormLabel>
            <span className={styles['input-length']}>
              {name?.length ? name.length : 0} / 50
            </span>
            <Input
              variant="unstyled"
              className={styles.input}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Name must be at most 50 characters',
                },
              })}
            />
          </FormControl>
          <Text className={styles['input-error']}>
            {errors.name?.message}&nbsp;
          </Text>
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
          <Text className={styles['input-error']}>
            {errors.email?.message || error}&nbsp;
          </Text>
          {/* Password input */}
          <Box className={styles['form-box']}>
            <Flex flexDir="column" gap={2}>
              <Text className={styles['form-box-title']}>Your password</Text>
              <Text className={styles['form-box-subtitle']}>
                This will not be shown publicly. Confirm your own password and
                don&lsquo;t share it with anyone.
              </Text>
            </Flex>
            <FormControl
              className={styles['input-container']}
              data-invalid={
                errors.password?.type === 'required' ||
                errors.password?.type === 'minLength'
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
          </Box>
          <Text className={styles['input-error']}>
            {errors.password?.message}&nbsp;
          </Text>
          <Button
            type="submit"
            disabled={!name || !email || !password}
            isLoading={loading}
            className={styles['form-button']}
          >
            Sign up
          </Button>
        </form>
      </ModalBody>
    </ModalLayout>
  );
};
export default SignUpFormModal;
