import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { IoClose, IoEarth } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import Image from 'next/image';
import TextareaAutosize from 'react-textarea-autosize';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import icons from './icons';
import useTweets from '../../../hooks/useTweets';
import styles from './TwitterInput.module.css';

type EmojiBoxProps = {
  Icon: IconType;
  onSelct: (emoji: any) => void;
};

const EmojiBox = ({ Icon, onSelct }: EmojiBoxProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Box>
          <Icon />
        </Box>
      </PopoverTrigger>
      <PopoverContent className={styles['popover-content']}>
        <PopoverArrow />
        <PopoverBody bg="transparent" border="none">
          <Picker
            data={data}
            onEmojiSelect={onSelct}
            searchPosition="none"
            previewPosition="none"
            theme="light"
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

type Props = {
  onClose?: VoidFunction; // If you want to close the modal
};

const TwitterInput = ({ onClose }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer>('');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imagePickRef = useRef<HTMLInputElement | null>(null);

  const { loading, error, addTweet } = useTweets();

  const toast = useToast();

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  // Handlers
  const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Select image
  const imagePickHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = readerEvent => {
      if (readerEvent.target?.result) {
        setSelectedImage(readerEvent.target.result);
      }
    };
    e.target.value = '';
  };

  // Add emoji to textarea
  const addEmoji = (emoji: any) => {
    setInputValue(inputValue + emoji.native || emoji.native);
  };

  // Add tweet
  const buttonClickHandler = () => {
    addTweet(inputValue, selectedImage as string).finally(() => {
      if (onClose) onClose();
      setInputValue('');
      setSelectedImage('');
      // Send toast
      toast({
        render: () => (
          <Box className={styles.toast}>
            <Text>{error || 'Your Tweet was sent.'}</Text>
          </Box>
        ),
      });
    });
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.box}>
        <TextareaAutosize
          ref={textareaRef}
          value={inputValue}
          onChange={changeHandler}
          placeholder="What's happening?"
          className={styles.textarea}
          maxLength={280}
          data-image={selectedImage ? true : false}
        />
        {selectedImage && (
          <Box className={styles['image-container']}>
            <Image
              src={selectedImage as string}
              alt="Selected image"
              objectFit="cover"
              layout="fill"
            />
            <Box
              className={styles['image-close']}
              onClick={() => setSelectedImage('')}
            >
              <IoClose />
            </Box>
            <Box className={styles['image-edit']}>Edit</Box>
          </Box>
        )}
        <Box className={styles.privacy}>
          <IoEarth className={styles['privacy-icon']} />
          <span>Everyone can reply</span>
        </Box>
      </Box>
      {/* Actions */}
      <Box className={styles.actions}>
        <Box className={styles['actions-left']}>
          {icons.map(({ name, Icon }) => (
            <Tooltip
              key={name}
              label={name}
              aria-label={name}
              className={styles.tooltip}
            >
              <Box className={styles['actions-left-item']} data-name={name}>
                {name === 'Media' && (
                  <Icon onClick={() => imagePickRef.current?.click()} />
                )}
                {name === 'Media' && (
                  <input
                    hidden={true}
                    type="file"
                    name="file"
                    ref={imagePickRef}
                    onChange={imagePickHandler}
                  />
                )}
                {name === 'Emoji' && (
                  <EmojiBox Icon={Icon} onSelct={addEmoji} />
                )}
                {name !== 'Media' && name !== 'Emoji' && <Icon />}
              </Box>
            </Tooltip>
          ))}
        </Box>
        <Box className={styles['actions-right']}>
          <CircularProgress
            size="23px"
            max={280}
            value={inputValue.length}
            hidden={inputValue.length === 0}
          />
          <Box h="30px" w="1px" bg="gray.300" hidden={inputValue.length === 0}>
            &nbsp;
          </Box>
          <Button
            className={styles['actions-right-button']}
            disabled={inputValue.length === 0 && !selectedImage}
            isLoading={loading}
            onClick={buttonClickHandler}
          >
            Tweet
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TwitterInput;
