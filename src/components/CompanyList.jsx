import { VStack, Button, Collapse, useDisclosure, Box, Text } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp, FaAmazon, FaMicrosoft, FaFacebook, FaGoogle, FaNewspaper } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const companyIcons = {
  FaAmazon,
  FaMicrosoft,
  FaFacebook,
  FaGoogle,
  FaNewspaper
};

const CompanyList = ({ companies, onSelect }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <VStack spacing={4} align="stretch">
      <Button
        onClick={onToggle}
        variant="outline"
        rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
        aria-label={isOpen ? 'Collapse company list' : 'Expand company list'}
      >
        Companies
      </Button>
      <Collapse in={isOpen}>
        <VStack spacing={2} align="stretch">
          {companies.map(company => {
            const Icon = companyIcons[company.icon] || FaAmazon;
            return (
              <Box
                key={company.name}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
                _hover={{ bg: { base: 'gray.50', _dark: 'gray.700' }, cursor: 'pointer' }}
                onClick={() => onSelect(company.name)}
                role="button"
                tabIndex={0}
                onKeyPress={e => e.key === 'Enter' && onSelect(company.name)}
                display="flex"
                alignItems="center"
              >
                <IconContext.Provider value={{ size: '1.5em', style: { marginRight: '8px' } }}>
                  <Icon />
                </IconContext.Provider>
                <Box>
                  <Text fontWeight="medium">{company.name}</Text>
                  <Text fontSize="sm" color={{ base: 'gray.500', _dark: 'gray.400' }}>
                    {company.questions.length} questions
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

export default CompanyList;