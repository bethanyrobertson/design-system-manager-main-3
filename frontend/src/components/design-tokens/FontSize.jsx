import React, { useState } from 'react';
import { Flex, Text, Button } from '@radix-ui/themes';
import { CopyIcon } from '@radix-ui/react-icons';
import { CodeSnippet } from '../application/code-snippet/code-snippet';

const FontSize = ({ tokens }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [copiedToken, setCopiedToken] = useState(null);

  // Format token name for display
  const formatTokenName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const typographyScale = [
    // Display
    { 
      category: 'Display',
      name: 'Display Large', 
      fontSize: '3.5625rem', 
      lineHeight: '4rem', 
      letterSpacing: '-0.015625rem',
      sampleText: 'Display Large'
    },
    { 
      category: 'Display',
      name: 'Display Medium', 
      fontSize: '2.8125rem', 
      lineHeight: '3.25rem', 
      letterSpacing: '0rem',
      sampleText: 'Display Medium'
    },
    { 
      category: 'Display',
      name: 'Display Small', 
      fontSize: '2.25rem', 
      lineHeight: '2.75rem', 
      letterSpacing: '0rem',
      sampleText: 'Display Small'
    },
    // Headline
    { 
      category: 'Headline',
      name: 'Headline Large', 
      fontSize: '2rem', 
      lineHeight: '2.5rem', 
      letterSpacing: '0rem',
      sampleText: 'Headline Large'
    },
    { 
      category: 'Headline',
      name: 'Headline Medium', 
      fontSize: '1.75rem', 
      lineHeight: '2.25rem', 
      letterSpacing: '0rem',
      sampleText: 'Headline Medium'
    },
    { 
      category: 'Headline',
      name: 'Headline Small', 
      fontSize: '1.5rem', 
      lineHeight: '2rem', 
      letterSpacing: '0rem',
      sampleText: 'Headline Small'
    },
    // Title
    { 
      category: 'Title',
      name: 'Title Large', 
      fontSize: '1.375rem', 
      lineHeight: '1.75rem', 
      letterSpacing: '0rem',
      sampleText: 'Title Large'
    },
    { 
      category: 'Title',
      name: 'Title Medium', 
      fontSize: '1rem', 
      lineHeight: '1.5rem', 
      letterSpacing: '0.009375rem',
      sampleText: 'Title Medium'
    },
    { 
      category: 'Title',
      name: 'Title Small', 
      fontSize: '0.875rem', 
      lineHeight: '1.25rem', 
      letterSpacing: '0.00625rem',
      sampleText: 'Title Small'
    },
    // Body
    { 
      category: 'Body',
      name: 'Body Large', 
      fontSize: '1rem', 
      lineHeight: '1.5rem', 
      letterSpacing: '0.03125rem',
      sampleText: 'Body Large text for paragraphs and content'
    },
    { 
      category: 'Body',
      name: 'Body Medium', 
      fontSize: '0.875rem', 
      lineHeight: '1.25rem', 
      letterSpacing: '0.015625rem',
      sampleText: 'Body Medium text for paragraphs and content'
    },
    { 
      category: 'Body',
      name: 'Body Small', 
      fontSize: '0.75rem', 
      lineHeight: '1rem', 
      letterSpacing: '0.025rem',
      sampleText: 'Body Small text for paragraphs and content'
    },
    // Label
    { 
      category: 'Label',
      name: 'Label Large', 
      fontSize: '0.875rem', 
      lineHeight: '1.25rem', 
      letterSpacing: '0.00625rem',
      sampleText: 'Label Large'
    },
    { 
      category: 'Label',
      name: 'Label Medium', 
      fontSize: '0.75rem', 
      lineHeight: '1rem', 
      letterSpacing: '0.03125rem',
      sampleText: 'Label Medium'
    },
    { 
      category: 'Label',
      name: 'Label Small', 
      fontSize: '0.6875rem', 
      lineHeight: '1rem', 
      letterSpacing: '0.03125rem',
      sampleText: 'Label Small'
    }
  ];

  const codeString = `const typographyScale = {
${typographyScale.map(token => `  '${token.name.toLowerCase().replace(/\s+/g, '-')}': {
    fontSize: '${token.fontSize}',
    lineHeight: '${token.lineHeight}',
    letterSpacing: '${token.letterSpacing}'
  }`).join(',\n')}
};`;

  return (
    <div className="rounded-lg p-6 bg-gray-1 space-y-4">
      <Text size="6" weight="bold">Typography</Text>
      
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
        <div className="space-y-8">
          {/* Group tokens by category */}
          {['Display', 'Headline', 'Title', 'Body', 'Label'].map(category => {
            const categoryTokens = typographyScale.filter(token => token.category === category);
            return (
              <div key={category} className="space-y-4">
                <Text size="4" weight="bold" color="gray">{category}</Text>
                <div className="space-y-4">
                  {categoryTokens.map((token) => (
                    <div key={token.name} className="flex items-center gap-6 py-4">
                      <div className="flex-shrink-0 w-40">
                        <Text size="2" weight="bold" className="block">{token.name}</Text>
                        <Text size="1" color="gray">{token.fontSize}</Text>
                      </div>
                      <div className="flex-1">
                        <div 
                          style={{ 
                            fontSize: token.fontSize,
                            lineHeight: token.lineHeight,
                            letterSpacing: token.letterSpacing,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {token.sampleText}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
        </div>
      ) : (
        <CodeSnippet code={codeString} language="javascript" />
      )}
    </div>
  );
};

export default FontSize;
