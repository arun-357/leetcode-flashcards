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
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FaSearchPlus, FaSearchMinus, FaUndo } from 'react-icons/fa';

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
            <Box
              w="100%"
              maxH={{ base: '55vh', md: '75vh' }}
              borderRadius="md"
              boxShadow="md"
              bg={{ base: 'gray.50', _dark: 'gray.800' }}
              overflow="hidden"
              position="relative"
            >
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={5}
                wheel={{ step: 0.15 }}
                doubleClick={{ disabled: true }}
              >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <>
                    <HStack spacing={2} position="absolute" top={2} right={2} zIndex={2}>
                      <Tooltip label="Zoom In"><IconButton size="sm" icon={<FaSearchPlus />} aria-label="Zoom In" onClick={zoomIn} /></Tooltip>
                      <Tooltip label="Zoom Out"><IconButton size="sm" icon={<FaSearchMinus />} aria-label="Zoom Out" onClick={zoomOut} /></Tooltip>
                      <Tooltip label="Reset"><IconButton size="sm" icon={<FaUndo />} aria-label="Reset Zoom" onClick={resetTransform} /></Tooltip>
                    </HStack>
                    <Box w="100%" h={{ base: '50vh', md: '70vh' }} display="flex" alignItems="center" justifyContent="center">
                      <TransformComponent>
                        <Image
                          src={current.src}
                          alt={current.name}
                          maxW="100%"
                          maxH={{ base: '50vh', md: '70vh' }}
                          mx="auto"
                          fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
                          draggable={false}
                          style={{ userSelect: 'none', pointerEvents: 'auto' }}
                        />
                      </TransformComponent>
                    </Box>
                  </>
                )}
              </TransformWrapper>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default HLDProjects;
