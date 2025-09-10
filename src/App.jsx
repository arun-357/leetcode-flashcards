import { useState, useMemo } from 'react';
import { Container, Heading, HStack, VStack, Text, Button, Input, Box, useColorMode } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FaMagnifyingGlass } from "react-icons/fa6";
import CategoryList from './components/CategoryList.jsx';
import FlashCardGame from './components/FlashCardGame.jsx';
import SearchResults from './components/SearchResults.jsx';
import LLDProjects from './components/LLDProjects.jsx';
import loadLldProjects from './data/lldLoader.js';
import staticLlds from './data/llds.js';
import HLDProjects from './components/HLDProjects.jsx';
import loadHldImages from './data/hldLoader.js';
import companyData from './data/companies.json';
import patternQuestions from './data/patterns.json';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryType, setCategoryType] = useState(null); // 'company', 'pattern', 'search', or 'lld'
  const [searchQuery, setSearchQuery] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  // Load dynamic LLD projects (from actual folders). Fallback to static if none.
  const lldProjects = useMemo(() => {
    const loaded = loadLldProjects();
    return Object.keys(loaded).length ? loaded : staticLlds;
  }, []);

  // Load HLD images
  const hldProjects = useMemo(() => loadHldImages(), []);

  const companies = [
    { name: 'Amazon', icon: 'FaAmazon', questions: companyData.Amazon || [] },
    { name: 'Microsoft', icon: 'FaMicrosoft', questions: companyData.Microsoft || [] },
    { name: 'Meta', icon: 'FaFacebook', questions: companyData.Meta || [] },
    { name: 'Google', icon: 'FaGoogle', questions: companyData.Google || [] },
    { name: 'Bloomberg', icon: 'FaNewspaper', questions: companyData.Bloomberg || [] },
    { name: 'Apple', icon: 'FaApple', questions: companyData.Apple || [] },
  ];

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

    Object.keys(companyData).forEach(companyName =>
      companyData[companyName].forEach(q => {
        if (!questionMap.has(q.title)) {
          questionMap.set(q.title, {
            ...q,
            source: companyName,
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
        {categoryType === 'hld' ? (
          <HLDProjects
            hlds={hldProjects}
            onBack={() => {
              setCategoryType(null);
              setSelectedCategory(null);
            }}
          />
        ) : categoryType === 'lld' ? (
          <LLDProjects
            projects={lldProjects}
            onBack={() => {
              setCategoryType(null);
              setSelectedCategory(null);
            }}
          />
        ) : selectedCategory ? (
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
            <HStack spacing={4} flexWrap="wrap">
              <Button
                variant="outline"
                width="100%"
                onClick={() => {
                  setCategoryType('lld');
                  setSelectedCategory('LLD');
                }}
                aria-label="View Low Level Design Projects"
              >
                Low Level Designs (LLD)
              </Button>
              <Button
                variant="outline"
                width="100%"
                onClick={() => {
                  setCategoryType('hld');
                  setSelectedCategory('HLD');
                }}
                aria-label="View High Level Design Projects"
              >
                High Level Designs (HLD)
              </Button>
            </HStack>
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