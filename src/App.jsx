import { useState } from 'react';
import { Box, Container, Heading, HStack, VStack, Text, Button, useColorMode } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import CompanyList from './components/CompanyList.jsx';
import FlashCardGame from './components/FlashCardGame.jsx';
import questionsData from './data/amz.json';

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const companies = [
    { name: 'Amazon', icon: 'FaAmazon', questions: questionsData },
    { name: 'Microsoft', icon: 'FaMicrosoft', questions: [] },
    { name: 'Meta', icon: 'FaFacebook', questions: [] },
  ];

  return (
    <Container maxW={{ base: '100%', md: 'container.xl' }} py={8} px={{ base: 4, md: 8 }}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading
            as="h1"
            size={{ base: 'lg', md: '2xl' }}
            textAlign="center"
            flex="1" // Center heading by using flex
          >
            NeetCode Flashcard Game
          </Heading>
          <Button
            onClick={toggleColorMode}
            aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            variant="outline"
          >
            {colorMode === 'light' ? <FaMoon /> : <FaSun />}
          </Button>
        </HStack>
        <Text textAlign="center" color={{ base: 'gray.600', _dark: 'gray.300' }}>
          Test your coding skills with company-specific algorithmic challenges
        </Text>
        {selectedCompany ? (
          <FlashCardGame
            company={selectedCompany}
            questions={companies.find(c => c.name === selectedCompany).questions}
            onBack={() => setSelectedCompany(null)}
          />
        ) : (
          <CompanyList companies={companies} onSelect={setSelectedCompany} />
        )}
      </VStack>
    </Container>
  );
};

export default App;