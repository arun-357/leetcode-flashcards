import { VStack, Box, Text } from '@chakra-ui/react';
import { FaCodeBranch, FaAmazon, FaMicrosoft, FaFacebook, FaGoogle, FaNewspaper } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const categoryIcons = {
  FaAmazon,
  FaMicrosoft,
  FaFacebook,
  FaGoogle,
  FaNewspaper,
  FaCodeBranch,
};

const SearchResults = ({ results, onSelect }) => {
  return (
    <VStack spacing={4} align="stretch" mt={4}>
      <Text fontWeight="bold" fontSize="lg">
        Search Results ({results.length})
      </Text>
      {results.length === 0 && (
        <Text color={{ base: 'gray.500', _dark: 'gray.400' }}>
          No results found.
        </Text>
      )}
      {results.map((result, index) => {
        const Icon = categoryIcons[result.sourceType === 'company' ? `Fa${result.source}` : 'FaCodeBranch'] || FaCodeBranch;
        return (
          <Box
            key={`${result.source}-${result.title}-${index}`}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
            _hover={{ bg: { base: 'gray.50', _dark: 'gray.700' }, cursor: 'pointer' }}
            onClick={() => onSelect(result)}
            role="button"
            tabIndex={0}
            onKeyPress={e => e.key === 'Enter' && onSelect(result)}
            display="flex"
            alignItems="center"
          >
            <IconContext.Provider value={{ size: '1.5em', style: { marginRight: '8px' } }}>
              <Icon />
            </IconContext.Provider>
            <Box>
              <Text fontWeight="medium">{result.title}</Text>
              <Text fontSize="sm" color={{ base: 'gray.500', _dark: 'gray.400' }}>
                {result.sourceType === 'company' ? `Company: ${result.source}` : `Pattern: ${result.source}`}
              </Text>
              <Text fontSize="sm" color={{ base: 'gray.500', _dark: 'gray.400' }}>
                Category: {result.category}
              </Text>
            </Box>
          </Box>
        );
      })}
    </VStack>
  );
};

export default SearchResults;