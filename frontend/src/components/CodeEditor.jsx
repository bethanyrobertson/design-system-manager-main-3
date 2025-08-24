import React, { useState } from 'react';
import { Box, Text, Button, TextArea, Flex } from '@radix-ui/themes';

const CodeEditor = ({ initialCode = '', onSave, onCancel }) => {
  const [code, setCode] = useState(initialCode);

  const handleSave = () => {
    onSave(code);
  };

  const defaultTemplate = `// Define your component here
const Component = () => {
  const [count, setCount] = useState(0);
  
  return (
    <Box className="p-4 border rounded-lg">
      <Text size="4" weight="bold" className="mb-2 block">
        Sample Component
      </Text>
      <Flex gap="2" align="center">
        <Button onClick={() => setCount(count - 1)}>-</Button>
        <Text size="3">Count: {count}</Text>
        <Button onClick={() => setCount(count + 1)}>+</Button>
      </Flex>
    </Box>
  );
};`;

  return (
    <Box className="space-y-4">
      <div>
        <Text size="2" weight="bold" className="mb-2 block">Component Code</Text>
        <Text size="1" color="gray" className="mb-3 block">
          Write your React component code. Available imports: React, useState, useEffect, Box, Text, Button, Flex
        </Text>
        <TextArea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={defaultTemplate}
          className="w-full h-64 font-mono text-sm"
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        />
      </div>
      
      <Flex gap="2" justify="end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Component
        </Button>
      </Flex>
    </Box>
  );
};

export default CodeEditor;
