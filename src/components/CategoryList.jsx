import { VStack, Button, Collapse, useDisclosure, Box, Text } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp, FaAmazon, FaMicrosoft, FaFacebook, FaGoogle, FaNewspaper, FaCodeBranch, FaApple } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const categoryIcons = {
  FaAmazon,
  FaMicrosoft,
  FaFacebook,
  FaGoogle,
  FaNewspaper,
  FaCodeBranch,
  FaApple
};

const CategoryList = ({ title, categories, onSelect }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  return (
    <VStack spacing={4} align="stretch">
      <Button
        onClick={onToggle}
        variant="outline"
        rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
        aria-label={isOpen ? `Collapse ${title} list` : `Expand ${title} list`}
      >
        {title}
      </Button>
      <Collapse in={isOpen}>
        <VStack spacing={2} align="stretch">
          {categories.map(category => {
            const Icon = categoryIcons[category.icon] || FaCodeBranch;
            return (
              <Box
                key={category.name}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
                _hover={{ bg: { base: 'gray.50', _dark: 'gray.700' }, cursor: 'pointer' }}
                onClick={() => onSelect(category.name)}
                role="button"
                tabIndex={0}
                onKeyPress={e => e.key === 'Enter' && onSelect(category.name)}
                display="flex"
                alignItems="center"
              >
                <IconContext.Provider value={{ size: '1.5em', style: { marginRight: '8px' } }}>
                  <Icon />
                </IconContext.Provider>
                <Box>
                  <Text fontWeight="medium">{category.name}</Text>
                  <Text fontSize="sm" color={{ base: 'gray.500', _dark: 'gray.400' }}>
                    {category.questions.length} questions
                  </Text>
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default CategoryList;