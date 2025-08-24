import React, { useState } from 'react';
import { Text, Button, Flex } from '@radix-ui/themes';
import { CopyIcon } from '@radix-ui/react-icons';

export default function ColorGrid({ tokens }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copiedToken, setCopiedToken] = useState(null);

  // Debug logging
  console.log('ColorGrid received tokens:', tokens);
  console.log('Tokens length:', tokens?.length);

  // Format token name for display
  const formatTokenName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get usage description for color tokens
  const getUsageDescription = (tokenName) => {
    const name = tokenName.toLowerCase();
    
    if (name.includes('primary')) return 'Primary brand color for key actions and highlights';
    if (name.includes('secondary')) return 'Secondary brand color for supporting elements';
    if (name.includes('success') || name.includes('green')) return 'Success states, confirmations, and positive feedback';
    if (name.includes('warning') || name.includes('yellow')) return 'Warning states and cautionary messages';
    if (name.includes('error') || name.includes('red')) return 'Error states, destructive actions, and alerts';
    if (name.includes('info') || name.includes('blue')) return 'Informational content and neutral actions';
    if (name.includes('gray') || name.includes('grey')) {
      if (name.includes('1') || name.includes('2')) return 'Background colors and subtle surfaces';
      if (name.includes('11') || name.includes('12')) return 'High contrast text and important content';
      return 'Text, borders, and UI element colors';
    }
    if (name.includes('background') || name.includes('bg')) return 'Background surfaces and containers';
    if (name.includes('text') || name.includes('foreground')) return 'Text content and readable elements';
    if (name.includes('border')) return 'Borders, dividers, and outline elements';
    
    return 'General purpose color token for various UI elements';
  };
  
  // Get all color tokens and sort them properly
  const colorTokens = tokens
    .filter(token => token.category === 'color')
    .sort((a, b) => {
      // Extract color name and number for sorting
      const getColorInfo = (name) => {
        const match = name.match(/^([a-zA-Z-]+?)(\d+)$/);
        if (match) {
          return { colorName: match[1], number: parseInt(match[2]) };
        }
        return { colorName: name, number: 0 };
      };
      
      const aInfo = getColorInfo(a.name);
      const bInfo = getColorInfo(b.name);
      
      // First sort by color name
      if (aInfo.colorName !== bInfo.colorName) {
        return aInfo.colorName.localeCompare(bInfo.colorName);
      }
      
      // Then sort by number
      return aInfo.number - bInfo.number;
    });
  console.log('Filtered and sorted color tokens:', colorTokens);

  const codeString = `const colors = {
${colorTokens.map(token => `  ${token.name}: '${token.value}'`).join(',\n')}
};`;

  const handleCopyColor = (tokenValue, tokenId) => {
    console.log('Copy clicked:', tokenValue, tokenId);
    navigator.clipboard.writeText(tokenValue);
    setCopiedToken(tokenId);
    console.log('Copied token set to:', tokenId);
    setTimeout(() => {
      setCopiedToken(null);
      console.log('Copied token cleared');
    }, 2000);
  };

  return (
    <div className="rounded-lg p-6 bg-gray-1 space-y-4">
      <Text size="6" weight="bold">Colors</Text>
      
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
        <div className="space-y-6">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-6 text-sm font-medium text-gray-11">
            <div className="col-span-2">Swatch</div>
            <div className="col-span-3">Token Name</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-5">Usage</div>
          </div>
          
          {/* Color Token Rows */}
          <div className="space-y-2">
            {colorTokens.map((token) => (
              <div key={token._id} className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-2 rounded-lg transition-colors group">
                {/* Swatch */}
                <div className="col-span-2 flex items-center">
                  <div
                    className="w-12 h-8 rounded-lg border border-gray-6"
                    style={{ backgroundColor: token.value }}
                  />
                </div>
                
                {/* Token Name */}
                <div className="col-span-3 flex items-center">
                  <div className="bg-gray-3 px-2 py-1 rounded text-sm font-mono text-gray-12">
                    {token.name}
                  </div>
                </div>
                
                {/* Value with Copy */}
                <div className="col-span-2 flex items-center">
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 text-sm text-gray-11 hover:text-gray-12 transition-colors group/copy"
                      onClick={() => handleCopyColor(token.value, token._id)}
                      title={`Copy ${token.value}`}
                    >
                      <span className="font-mono">{token.value}</span>
                      <div className="relative">
                        <CopyIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 group/copy:opacity-100 transition-opacity" />
                        {copiedToken === token._id && (
                          <div className="absolute -top-10 -left-6 bg-black dark:bg-gray-8 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50 animate-pulse">
                            Copied!
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Usage Description */}
                <div className="col-span-5 flex items-center">
                  <Text size="2" color="gray" className="leading-relaxed">
                    {getUsageDescription(token.name)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
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
}
