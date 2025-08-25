import React, { useState } from 'react';
import { Flex, Text, Button } from '@radix-ui/themes';
import { CopyIcon } from '@radix-ui/react-icons';
import { CodeSnippet } from '../application/code-snippet/code-snippet';

const BorderRadius = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [copiedToken, setCopiedToken] = useState(null);

  const borderRadiusValues = [
    { name: '1', value: '0.125rem', pixels: 2 },
    { name: '2', value: '0.25rem', pixels: 4 },
    { name: '3', value: '0.375rem', pixels: 6 },
    { name: '4', value: '0.5rem', pixels: 8 },
    { name: '5', value: '0.75rem', pixels: 12 },
    { name: '6', value: '1rem', pixels: 16 }
  ];

  const codeString = `const borderRadius = {
${borderRadiusValues.map(radius => `  ${radius.name}: '${radius.value}'`).join(',\n')}
};`;

  return (
    <div className="rounded-lg p-6 bg-gray-1 space-y-4">
      <div className="space-y-2">
        <Text size="6" weight="bold">Radius scale</Text>
        <Text size="3" color="gray">Radius values used in the components are derived from a 6-step scale.</Text>
      </div>
      
      {/* Tab Navigation */}
      <Flex gap="1">
        <Button
          variant={activeTab === 'preview' ? 'solid' : 'soft'}
          size="1"
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </Button>
        <Button
          variant={activeTab === 'code' ? 'solid' : 'soft'}
          size="1"
          onClick={() => setActiveTab('code')}
        >
          Code
        </Button>
      </Flex>

      {/* Content */}
      {activeTab === 'preview' ? (
        <div className="space-y-4">
          <div className="border border-gray-4 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center">
              {borderRadiusValues.map((radius) => (
                <div key={radius.name} className="flex flex-col items-center space-y-3">
                  <div 
                    className="w-20 h-12"
                    style={{ 
                      borderRadius: radius.value,
                      backgroundColor: '#9ca3af'
                    }}
                  />
                  <div className="text-center">
                    <Text size="2" weight="medium">{radius.name}</Text>
                    <br />
                    <Text size="1" color="gray">{radius.value}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <CodeSnippet code={codeString} language="javascript" />
      )}
    </div>
  );
};

export default BorderRadius;
