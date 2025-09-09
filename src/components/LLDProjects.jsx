// src/components/LLDProjects.jsx
import { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
  Select,
  Input,
  IconButton,
  Tooltip,
  useClipboard,
  useBreakpointValue,
  Collapse,
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';
import { CopyBlock, dracula, atomOneDark } from 'react-code-blocks';
import ReactMarkdown from 'react-markdown';

// props: projects (object), onBack (fn)
const LLDProjects = ({ projects, onBack }) => {
  const [selectedProjectKey, setSelectedProjectKey] = useState(Object.keys(projects)[0]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const { colorMode } = useColorMode();
  const [fileFilter, setFileFilter] = useState('');
  const { onCopy, hasCopied } = useClipboard('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const projectKeys = Object.keys(projects);
  const project = projects[selectedProjectKey];
  const files = project.files;
  const filteredFiles = useMemo(() => {
    if (!fileFilter.trim()) return files;
    const term = fileFilter.toLowerCase();
    return files.filter(f => f.name.toLowerCase().includes(term));
  }, [files, fileFilter]);
  const currentFile = files[selectedFileIndex];

  // Derive a concise summary (first non-empty line without markdown heading hashes)
  const projectSummary = useMemo(() => {
    if (!project.description) return '';
    const lines = project.description.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (!lines.length) return '';
    const first = lines[0].replace(/^#+\s*/, '');
    return first.length > 140 ? first.slice(0, 137) + '...' : first;
  }, [project.description]);

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" flexWrap="wrap">
        <Button onClick={onBack} variant="outline" size="sm">Back</Button>
        <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">Low Level Design Projects</Text>
      </HStack>
      <HStack spacing={4} flexWrap="wrap" align="center">
        <Select
          maxW={{ base: '100%', sm: '260px' }}
          value={selectedProjectKey}
          onChange={e => { setSelectedProjectKey(e.target.value); setSelectedFileIndex(0); setFileFilter(''); }}
          aria-label="Select LLD project"
        >
          {projectKeys.map(key => (
            <option value={key} key={key}>{key}</option>
          ))}
        </Select>
        <Badge colorScheme="purple">{files.length} files</Badge>
      </HStack>
      <Card>
        <CardHeader>
          <VStack align="stretch" spacing={2}>
            <Text fontSize="lg" fontWeight="bold">{selectedProjectKey}</Text>
            {projectSummary && (
              <Text fontSize="sm" color={{ base: 'gray.600', _dark: 'gray.400' }}>{projectSummary}</Text>
            )}
            <Text fontSize="sm" fontFamily="mono">Viewing: {currentFile.name}</Text>
          </VStack>
        </CardHeader>
        <CardBody>
          <Tabs variant="enclosed" size="sm">
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Code</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box className="lld-description" maxW="full">
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children, ...props }) {
                        return inline ? (
                          <code className={className} {...props}>{children}</code>
                        ) : (
                          <CopyBlock
                            text={String(children).trim()}
                            language={(className || '').replace('language-', '') || 'text'}
                            showLineNumbers={false}
                            theme={colorMode === 'light' ? atomOneDark : dracula}
                            wrapLines
                            codeBlock
                          />
                        );
                      }
                    }}
                  >
                    {project.description}
                  </ReactMarkdown>
                </Box>
              </TabPanel>
              <TabPanel p={0}>
                {isMobile ? (
                  <VStack align="stretch" spacing={3} p={3}>
                    <HStack spacing={3} align="center">
                      <Select
                        flex={1}
                        value={selectedFileIndex}
                        onChange={e => setSelectedFileIndex(parseInt(e.target.value))}
                        aria-label="Select file"
                      >
                        {files.map((f, idx) => (
                          <option key={f.name+idx} value={idx}>{f.name}</option>
                        ))}
                      </Select>
                      <Button size="sm" variant="outline" onClick={() => setShowMobileFilter(v => !v)}>
                        {showMobileFilter ? 'Hide Filter' : 'Filter'}
                      </Button>
                    </HStack>
                    <Collapse in={showMobileFilter} animateOpacity>
                      <Input
                        mt={2}
                        placeholder="Filter files..."
                        size="sm"
                        value={fileFilter}
                        onChange={e => {
                          setFileFilter(e.target.value);
                          // Adjust selected file if filtered out
                          const filtered = files.filter(f => f.name.toLowerCase().includes(e.target.value.toLowerCase()));
                          if (!filtered.includes(files[selectedFileIndex]) && filtered.length) {
                            const firstIdx = files.indexOf(filtered[0]);
                            setSelectedFileIndex(firstIdx);
                          }
                        }}
                        aria-label="Filter files"
                      />
                    </Collapse>
                    <Box p={2} borderWidth="1px" borderRadius="md" w="100%" bg={{ base: 'gray.50', _dark: 'gray.800' }}>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontFamily="mono" noOfLines={1}>{currentFile.name}</Text>
                        <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} closeOnClick={false}>
                          <IconButton
                            size="xs"
                            variant="outline"
                            aria-label="Copy file contents"
                            icon={<FaCopy />}
                            onClick={() => { navigator.clipboard.writeText(currentFile.content); onCopy(); }}
                          />
                        </Tooltip>
                      </HStack>
                      <Box maxH="60vh" overflow="auto">
                        {currentFile.type === 'markdown' || currentFile.language === 'markdown' ? (
                          <ReactMarkdown>{currentFile.content}</ReactMarkdown>
                        ) : (
                          <CopyBlock
                            text={currentFile.content}
                            language={currentFile.language || 'text'}
                            showLineNumbers
                            theme={colorMode === 'light' ? atomOneDark : dracula}
                            wrapLines
                            codeBlock
                          />
                        )}
                      </Box>
                    </Box>
                  </VStack>
                ) : (
                  <HStack align="stretch" spacing={0} flexWrap="nowrap">
                    <VStack
                      align="stretch"
                      spacing={2}
                      p={3}
                      w={{ base: '45%', md: '260px' }}
                      maxW={{ base: '50%', md: '300px' }}
                      borderRightWidth="1px"
                      borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
                      bg={{ base: 'gray.50', _dark: 'gray.800' }}
                    >
                      <Input
                        placeholder="Filter files..."
                        size="sm"
                        value={fileFilter}
                        onChange={e => setFileFilter(e.target.value)}
                        aria-label="Filter files"
                      />
                      <VStack align="stretch" spacing={1} overflowY="auto" maxH="60vh" pr={1}>
                        {filteredFiles.map((f, idx) => (
                          <Box
                            key={f.name+idx}
                            p={2}
                            borderWidth="1px"
                            borderRadius="md"
                            fontSize="sm"
                            bg={idx === selectedFileIndex ? (colorMode==='light' ? 'purple.50':'purple.900') : 'transparent'}
                            _hover={{ cursor: 'pointer', bg: colorMode==='light' ? 'gray.100':'gray.700' }}
                            onClick={() => setSelectedFileIndex(files.indexOf(f))}
                          >
                            <HStack justify="space-between" spacing={2}>
                              <Text noOfLines={1}>{f.name}</Text>
                              <Badge>{f.language}</Badge>
                            </HStack>
                          </Box>
                        ))}
                        {filteredFiles.length === 0 && (
                          <Text fontSize="xs" color="gray.500">No files</Text>
                        )}
                      </VStack>
                    </VStack>
                    <Box flex="1" p={3} overflow="auto" maxH="70vh" position="relative">
                      <HStack justify="space-between" mb={2} align="center" spacing={3}>
                        <Text fontSize="sm" fontWeight="medium" fontFamily="mono">{currentFile.name}</Text>
                        <Tooltip label={hasCopied ? 'Copied!' : 'Copy file'} closeOnClick={false}>
                          <IconButton
                            size="xs"
                            variant="outline"
                            aria-label="Copy file contents"
                            icon={<FaCopy />}
                            onClick={() => { navigator.clipboard.writeText(currentFile.content); onCopy(); }}
                          />
                        </Tooltip>
                      </HStack>
                      {currentFile.type === 'markdown' || currentFile.language === 'markdown' ? (
                        <ReactMarkdown>{currentFile.content}</ReactMarkdown>
                      ) : (
                        <CopyBlock
                          text={currentFile.content}
                          language={currentFile.language || 'text'}
                          showLineNumbers
                          theme={colorMode === 'light' ? atomOneDark : dracula}
                          wrapLines
                          codeBlock
                        />
                      )}
                    </Box>
                  </HStack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default LLDProjects;
