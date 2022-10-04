import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import useAuth from '../../hooks/useAuth';

type Props = {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
};

const UserAvatar = ({ src, alt, width, height }: Props) => {
  const { user } = useAuth();

  return (
    <Box
      position="relative"
      rounded="full"
      overflow="hidden"
      width={width ? width : '4rem'}
      height={height ? height : '4rem'}
    >
      <Image
        src={src ? src : user?.photoURL || ''}
        alt={alt ? alt : user?.displayName || ''}
        layout="fill"
        objectFit="cover"
      />
    </Box>
  );
};

export default UserAvatar;
