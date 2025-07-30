import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  HStack,
  Card,
  CardBody,
  CardHeader,
  useColorMode,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { CopyBlock, dracula, atomOneDark } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';

const FlashCardGame = ({ company, pattern, questions, onBack, categoryType }) => {
  const [numQuestions, setNumQuestions] = useState('');
  const [gameStarted, setGameStarted] = useState(!!pattern);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState(
    pattern ? [...questions].sort(() => Math.random() - 0.5) : []
  );
  const [errorMessage, setErrorMessage] = useState('');
  const { colorMode } = useColorMode();

  const startGame = () => {
    const p = parseInt(numQuestions);
    if (p > 0 && p <= questions.length) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, p);
      setSelectedQuestions(shuffled);
      setGameStarted(true);
      setErrorMessage('');
    } else {
      setErrorMessage(`Please enter a number between 1 and ${questions.length}.`);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isSingleQuestion = questions.length === 1 && categoryType === 'search';

  return (
    <VStack spacing={6} align="stretch">
      <Button
        leftIcon={<FaArrowLeft />}
        onClick={onBack}
        alignSelf="flex-start"
        aria-label="Back to main page"
      >
        Back
      </Button>
      <Heading as="h2" size={{ base: 'md', md: 'lg' }}>
        {company || pattern || 'Question'} Questions
      </Heading>
      {!gameStarted && !isSingleQuestion ? (
        <VStack spacing={4}>
          <Text>How many questions would you like to play?</Text>
          <HStack>
            <Input
              type="number"
              value={numQuestions}
              onChange={e => setNumQuestions(e.target.value)}
              placeholder="Number of questions"
              maxW={{ base: '150px', md: '200px' }}
              aria-label="Number of questions"
            />
            <Button
              onClick={startGame}
              colorScheme="brand"
              variant="solid"
              isDisabled={!numQuestions}
              aria-label="Start game"
            >
              Start Game
            </Button>
          </HStack>
          {errorMessage && (
            <Text color="red.500" fontSize="sm">
              {errorMessage}
            </Text>
          )}
        </VStack>
      ) : (
        <Card>
          <CardHeader>
            <Heading size={{ base: 'sm', md: 'md' }}>
              {isSingleQuestion
                ? `Question: ${questions[0].title}`
                : `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`}
            </Heading>
          </CardHeader>
          <CardBody>
            {(isSingleQuestion ? questions : selectedQuestions)[currentQuestionIndex] && (
              <VStack spacing={4} align="stretch">
                <Text fontWeight="bold">
                  Problem:{' '}
                  {(isSingleQuestion ? questions : selectedQuestions)[currentQuestionIndex].title}
                </Text>
                <Box>
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children, ...props }) {
                        return inline ? (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        ) : (
                          <CopyBlock
                            text={String(children).trim()}
                            language="text"
                            showLineNumbers={false}
                            theme={colorMode === 'light' ? atomOneDark : dracula}
                            wrapLines
                            codeBlock
                          />
                        );
                      },
                      p({ children }) {
                        return <Text mb={2}>{children}</Text>;
                      },
                      strong({ children }) {
                        return <Text as="span" fontWeight="bold">{children}</Text>;
                      },
                    }}
                  >
                    {(isSingleQuestion ? questions : selectedQuestions)[currentQuestionIndex].description}
                  </ReactMarkdown>
                </Box>
                <Text fontWeight="bold">Solution:</Text>
                <CopyBlock
                  text={(isSingleQuestion ? questions : selectedQuestions)[currentQuestionIndex].solution}
                  language="python"
                  showLineNumbers={true}
                  theme={colorMode === 'light' ? atomOneDark : dracula}
                  wrapLines
                  codeBlock
                />
                <Text>
                  Pattern:{' '}
                  {(isSingleQuestion ? questions : selectedQuestions)[currentQuestionIndex].category}
                </Text>
                <Text>
                  Time Complexity:{' '}
                  {(isSingleQuestion ? questions : selectedQuestions)[currentQuestionIndex].time_complexity}
                </Text>
                <Text>
                  Space Complexity:{' '}
                  {(isSingleQuestion ? questions : selectedQuestions)[currentQuestionIndex].space_complexity}
                </Text>
                {!isSingleQuestion && (
                  <HStack justify="space-between" flexWrap="wrap">
                    <Button
                      onClick={prevQuestion}
                      isDisabled={currentQuestionIndex === 0}
                      leftIcon={<FaArrowLeft />}
                      aria-label="Previous question"
                      size={{ base: 'sm', md: 'md' }}
                      m={1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={nextQuestion}
                      isDisabled={currentQuestionIndex === selectedQuestions.length - 1}
                      rightIcon={<FaArrowRight />}
                      aria-label="Next question"
                      size={{ base: 'sm', md: 'md' }}
                      m={1}
                    >
                      Next
                    </Button>
                  </HStack>
                )}
              </VStack>
            )}
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default FlashCardGame;