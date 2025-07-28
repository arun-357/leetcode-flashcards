import { useState } from 'react';
import { Container, Heading, HStack, VStack, Text, Button, useColorMode } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import CategoryList from './components/CategoryList.jsx';
import FlashCardGame from './components/FlashCardGame.jsx';
import amzData from './data/amz.json';
import metaData from './data/meta.json';
import microsoftData from './data/microsoft.json';
import googleData from './data/google.json';
import bloombergData from './data/bloomberg.json';
import patternQuestions from './data/patterns.json';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryType, setCategoryType] = useState(null); // 'company' or 'pattern'
  const { colorMode, toggleColorMode } = useColorMode();

  const companies = [
    { name: 'Amazon', icon: 'FaAmazon', questions: amzData },
    { name: 'Microsoft', icon: 'FaMicrosoft', questions: microsoftData },
    { name: 'Meta', icon: 'FaFacebook', questions: metaData },
    { name: 'Google', icon: 'FaGoogle', questions: googleData },
    { name: 'Bloomberg', icon: 'FaNewspaper', questions: bloombergData },
  ];

  const patterns = Object.keys(patternQuestions).map(pattern => ({
    name: pattern,
    icon: 'FaCodeBranch',
    questions: patternQuestions[pattern],
  }));

  const handleSelect = (name, type) => {
    setSelectedCategory(name);
    setCategoryType(type);
  };

  return (
    <Container maxW={{ base: '100%', md: 'container.xl' }} py={8} px={{ base: 4, md: 8 }}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading
            as="h1"
            size={{ base: 'lg', md: '2xl' }}
            textAlign="center"
            flex="1"
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
          Test your coding skills with company-specific or pattern-based algorithmic challenges
        </Text>
        {selectedCategory ? (
          <FlashCardGame
            company={categoryType === 'company' ? selectedCategory : undefined}
            pattern={categoryType === 'pattern' ? selectedCategory : undefined}
            questions={
              categoryType === 'company'
                ? companies.find(c => c.name === selectedCategory).questions
                : patterns.find(p => p.name === selectedCategory).questions
            }
            onBack={() => {
              setSelectedCategory(null);
              setCategoryType(null);
            }}
          />
        ) : (
          <VStack spacing={8} align="stretch">
            <CategoryList
              title="Companies"
              categories={companies}
              onSelect={name => handleSelect(name, 'company')}
            />
            <CategoryList
              title="Patterns"
              categories={patterns}
              onSelect={name => handleSelect(name, 'pattern')}
            />
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default App;