import { useState, useMemo } from 'react';
import { Container, Heading, HStack, VStack, Text, Button, Input, Box, useColorMode } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FaMagnifyingGlass } from "react-icons/fa6";
import CategoryList from './components/CategoryList.jsx';
import FlashCardGame from './components/FlashCardGame.jsx';
import SearchResults from './components/SearchResults.jsx';
import amzData from './data/amz.json';
import metaData from './data/meta.json';
import microsoftData from './data/microsoft.json';
import googleData from './data/google.json';
import bloombergData from './data/bloomberg.json';
import patternQuestions from './data/patterns.json';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryType, setCategoryType] = useState(null); // 'company', 'pattern', or 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  const companies = useMemo(() => [
    { name: 'Amazon', icon: 'FaAmazon', questions: amzData },
    { name: 'Microsoft', icon: 'FaMicrosoft', questions: microsoftData },
    { name: 'Meta', icon: 'FaFacebook', questions: metaData },
    { name: 'Google', icon: 'FaGoogle', questions: googleData },
    { name: 'Bloomberg', icon: 'FaNewspaper', questions: bloombergData },
  ], []);

  const patterns = Object.keys(patternQuestions).map(pattern => ({
    name: pattern,
    icon: 'FaCodeBranch',
    questions: patternQuestions[pattern],
  }));

  const allQuestions = useMemo(() => {
    const questionMap = new Map();

    patterns.forEach(pattern =>
      pattern.questions.forEach(q => {
        questionMap.set(q.title, {
          ...q,
          source: pattern.name,
          sourceType: 'pattern',
        });
      })
    );

    companies.forEach(company =>
      company.questions.forEach(q => {
        if (!questionMap.has(q.title)) {
          questionMap.set(q.title, {
            ...q,
            source: company.name,
            sourceType: 'company',
          });
        }
      })
    );

    return Array.from(questionMap.values());
  }, [companies, patterns]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return allQuestions.filter(
      q =>
        regex.test(q.title) ||
        regex.test(q.description) ||
        regex.test(q.category)
    );
  }, [searchQuery, allQuestions]);

  const handleSelect = (name, type) => {
    setSelectedCategory(name);
    setCategoryType(type);
    setSearchQuery('');
  };

  const handleSearchSelect = question => {
    setSelectedCategory(question);
    setCategoryType('search');
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
            LeetCode Flashcard Game
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
            categoryType={categoryType}
            questions={
              categoryType === 'search'
                ? [selectedCategory]
                : categoryType === 'company'
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
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
              bg={{ base: 'gray.50', _dark: 'gray.700' }}
            >
              <VStack spacing={4}>
                <HStack justify="center" w="100%">
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    maxW={{ base: '100%', md: '400px' }}
                    aria-label="Search questions"
                  />
                  <Button
                    aria-label="Search"
                    variant="outline"
                    leftIcon={<FaMagnifyingGlass />}
                    isDisabled={!searchQuery}
                  >
                    Search
                  </Button>
                </HStack>
                {searchQuery && (
                  <Box w="100%">
                    <SearchResults results={searchResults} onSelect={handleSearchSelect} />
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default App;