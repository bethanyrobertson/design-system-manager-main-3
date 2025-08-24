import React, { useState } from 'react';
import { Text, Button, Flex } from '@radix-ui/themes';

const Spacing = () => {
  const [activeTab, setActiveTab] = useState('preview');

  const spacingValues = [
    { sx: '0', resolved: '0px', primitive: '0', pixels: 0 },
    { sx: '1', resolved: '4px', primitive: '--base-size-4', pixels: 4 },
    { sx: '2', resolved: '8px', primitive: '--base-size-8', pixels: 8 },
    { sx: '3', resolved: '16px', primitive: '--base-size-16', pixels: 16 },
    { sx: '4', resolved: '24px', primitive: '--base-size-24', pixels: 24 },
    { sx: '5', resolved: '32px', primitive: '--base-size-32', pixels: 32 },
    { sx: '6', resolved: '40px', primitive: '--base-size-40', pixels: 40 },
    { sx: '7', resolved: '48px', primitive: '--base-size-48', pixels: 48 },
    { sx: '8', resolved: '64px', primitive: '--base-size-64', pixels: 64 },
    { sx: '9', resolved: '80px', primitive: '--base-size-80', pixels: 80 },
    { sx: '10', resolved: '96px', primitive: '--base-size-96', pixels: 96 },
    { sx: '11', resolved: '112px', primitive: '--base-size-112', pixels: 112 },
    { sx: '12', resolved: '128px', primitive: '--base-size-128', pixels: 128 }
  ];

  const codeString = `const spacing = {
${spacingValues.map(spacing => `  ${spacing.sx}: '${spacing.resolved}'`).join(',\n')}
}`;

  return (
    <div className="rounded-lg p-6 bg-gray-1 space-y-4">
      <Text size="6" weight="bold">Spacing</Text>
      
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
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-6">
            <Text size="2" weight="medium" color="gray">sx keyword</Text>
            <Text size="2" weight="medium" color="gray">resolved value</Text>
            <Text size="2" weight="medium" color="gray">primitive</Text>
          </div>
          
          {/* Spacing Rows */}
          {spacingValues.map((spacing) => (
            <div key={spacing.sx} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-3">
              {/* SX Keyword */}
              <div className="flex items-center">
                <Text size="2" weight="medium">{spacing.sx}</Text>
              </div>
              
              {/* Resolved Value with Visual Bar */}
              <div className="flex items-center gap-3">
                <Text size="2">{spacing.resolved}</Text>
                <div className="flex items-center">
                  <div 
                    className="rounded-sm"
                    style={{ 
                      backgroundColor: '#3b82f6',
                      width: spacing.pixels === 0 ? '2px' : `${Math.min(spacing.pixels * 0.8, 120)}px`,
                      height: spacing.pixels <= 2 ? '4px' : spacing.pixels <= 8 ? '6px' : '10px',
                      minWidth: '2px'
                    }}
                  />
                </div>
              </div>
              
              {/* Primitive */}
              <div className="flex items-center">
                <Text size="2" className="font-mono text-gray-11">{spacing.primitive}</Text>
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

export default Spacing;
