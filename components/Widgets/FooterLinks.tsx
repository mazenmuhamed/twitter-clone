import { Flex, Text } from '@chakra-ui/react';

const links = [
  'Terms of Service',
  'Privacy Policy',
  'Cookie Policy',
  'Accessibility',
  'Ads info',
  'More',
];

const FooterLinks = () => {
  const year = new Date().getFullYear();

  return (
    <Flex flexDirection="column" gap="0.3rem">
      <Flex flexWrap="wrap" alignItems="center" gap="3" mt="2rem" px="1rem">
        {links.map((link, idx) => (
          <Text
            key={idx}
            fontSize="1.3rem"
            color="gray.700"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            marginTop="-0.7rem"
          >
            {link}
          </Text>
        ))}
      </Flex>
      <Text fontSize="1.3rem" color="gray.700" px="1rem">
        &copy;{year} Twitter, Inc.
      </Text>
    </Flex>
  );
};
export default FooterLinks;
