import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalHeader,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCameraOutline } from 'react-icons/io5';
import useAuth from '../../hooks/useAuth';

import ModalLayout from '../UI/ModalLayout';
import UserAvatar from '../UI/UserAvatar';
import styles from './EditProfileModal.module.css';

type FormData = {
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
};

const EditProfileModal = ({ isOpen, onClose }: Props) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | ArrayBuffer>('');

  const { user, loading, updateUserProfile } = useAuth();
  const { register, handleSubmit, watch, formState } = useForm<FormData>({
    defaultValues: { name: user?.displayName ? user?.displayName : '' },
  });
  const { name } = watch();
  const { errors } = formState;

  const iconRef = useRef<HTMLInputElement | null>(null);

  // Select image
  const imagePickHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = readerEvent => {
      if (readerEvent.target?.result) {
        setSelectedPhoto(readerEvent.target.result);
      }
    };
    e.target.value = '';
  };

  const saveClickHandler = handleSubmit(data => {
    if (!user && !data.name && !selectedPhoto) return;
    updateUserProfile(data?.name, selectedPhoto as string).then(() => onClose());
  });

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <ModalHeader className={styles.header}>
        <Text className={styles['header-text']}>Edit profile</Text>
        <Button className={styles['header-button']} onClick={saveClickHandler} isLoading={loading}>
          Save
        </Button>
      </ModalHeader>
      <ModalBody className={styles.body}>
        <Box className={styles['body-cover']}>
          <Tooltip label="Add photo" className="tooltip">
            <Box className={styles['body-cover-icon']}>
              <IoCameraOutline />
            </Box>
          </Tooltip>
        </Box>
        <Box className={styles['body-container']}>
          <Box className={styles['body-container-avatar']}>
            {!selectedPhoto && <UserAvatar width="11rem" height="11rem" />}
            {selectedPhoto && (
              <UserAvatar width="11rem" height="11rem" src={selectedPhoto as string} />
            )}
            <Tooltip label="Add photo" className="tooltip">
              <Box
                className={styles['body-container-avatar-icon']}
                onClick={() => iconRef.current?.click()}
              >
                <IoCameraOutline />
                <input
                  ref={iconRef}
                  type="file"
                  accept="image/*"
                  onChange={imagePickHandler}
                  hidden={true}
                />
              </Box>
            </Tooltip>
          </Box>
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
            <span className={styles['input-length']}>{name?.length ? name.length : 0} / 50</span>
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
          <Text className={styles['input-error']}>{errors.name?.message}&nbsp;</Text>
        </Box>
      </ModalBody>
    </ModalLayout>
  );
};

export default EditProfileModal;
