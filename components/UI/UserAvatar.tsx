import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import useAuth from '../../hooks/useAuth';

type Props = {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  onClick?: VoidFunction;
};

const UserAvatar = ({ src, alt, width, height, onClick }: Props) => {
  const { user } = useAuth();

  return (
    <Box>
      <Box
        position="relative"
        rounded="full"
        overflow="hidden"
        width={width ? width : '4rem'}
        height={height ? height : '4rem'}
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
      >
        <Image
          src={src ? src : user?.photoURL || ''}
          alt={alt ? alt : user?.displayName || ''}
          layout="fill"
          objectFit="cover"
        />
      </Box>
    </Box>
  );
};

export default UserAvatar;
