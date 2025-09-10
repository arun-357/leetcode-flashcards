// src/components/HLDProjects.jsx
import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Select,
  useBreakpointValue,
  Image,
} from '@chakra-ui/react';

// props: hlds (array), onBack (fn)
const HLDProjects = ({ hlds, onBack }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const current = hlds[selectedIdx];

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" flexWrap="wrap">
        <Button onClick={onBack} variant="outline" size="sm">Back</Button>
        <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">High Level Designs (HLD)</Text>
      </HStack>
      <Card>
        <CardHeader>
          <HStack spacing={4} align="center">
            {isMobile ? (
              <Select
                value={selectedIdx}
                onChange={e => setSelectedIdx(Number(e.target.value))}
                aria-label="Select HLD"
                maxW="250px"
              >
                {hlds.map((hld, idx) => (
                  <option value={idx} key={hld.name}>{hld.name}</option>
                ))}
              </Select>
            ) : (
              <HStack spacing={2}>
                {hlds.map((hld, idx) => (
                  <Button
                    key={hld.name}
                    size="sm"
                    variant={idx === selectedIdx ? 'solid' : 'outline'}
                    colorScheme={idx === selectedIdx ? 'purple' : 'gray'}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    {hld.name}
                  </Button>
                ))}
              </HStack>
            )}
          </HStack>
        </CardHeader>
        <CardBody>
          <Box w="100%" textAlign="center">
            <Text fontWeight="medium" mb={2}>{current.name}</Text>
            <Image
              src={current.src}
              alt={current.name}
              maxW="100%"
              maxH={{ base: '50vh', md: '70vh' }}
              mx="auto"
              borderRadius="md"
              boxShadow="md"
              fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
            />
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default HLDProjects;
