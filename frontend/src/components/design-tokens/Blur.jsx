import React, { useState } from 'react';
import { Text, Button, Flex } from '@radix-ui/themes';

const Blur = () => {
  const [activeTab, setActiveTab] = useState('preview');

  const blurValues = [
    { name: '0', value: '0', displayValue: '0' },
    { name: 'none', value: '0', displayValue: 'none' },
    { name: 'sm', value: '4px', displayValue: '4px' },
    { name: 'DEFAULT', value: '8px', displayValue: '8px' },
    { name: 'md', value: '12px', displayValue: '12px' },
    { name: 'lg', value: '16px', displayValue: '16px' },
    { name: 'xl', value: '24px', displayValue: '24px' },
    { name: '2xl', value: '40px', displayValue: '40px' },
    { name: '3xl', value: '64px', displayValue: '64px' }
  ];

  const codeString = `const blur = {
${blurValues.map(blur => `  ${blur.name}: '${blur.value}'`).join(',\n')}
};`;

  return (
    <div className="rounded-lg p-6 bg-gray-1 space-y-4">
      <Text size="6" weight="bold">Blur</Text>
      
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
        <div className="flex justify-between items-center">
          {blurValues.map((blur) => (
            <div key={blur.name} className="flex flex-col items-center space-y-3">
              <div 
                className="w-20 h-12"
                style={{ 
                  backgroundColor: '#9ca3af',
                  filter: `blur(${blur.value})`
                }}
              />
              <div className="text-center">
                <Text size="2" weight="medium">{blur.name}</Text>
                <br />
                <Text size="1" color="gray">{blur.displayValue}</Text>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 p-4 rounded border">
          <pre className="text-xs overflow-x-auto">
            <code>{codeString}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default Blur;
