import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const ComponentPreview = ({ component }) => {
  if (!component.code) {
    return (
      <Box className="space-y-4">
        <div className="border border-gray-3 rounded-lg p-4 bg-gray-1">
          <Text size="2" weight="bold" className="mb-3 block">Preview</Text>
          <div className="min-h-[100px] flex items-center justify-center">
            <div className="p-4 border border-dashed border-gray-4 rounded-lg text-center text-gray-9 bg-gray-2">
              No code provided for this component
            </div>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      <div className="rounded-lg p-4 bg-gray-1" style={{border: '1px solid var(--border)'}}>
        <Text size="2" weight="bold" className="mb-3 block">Preview</Text>
        <div className="min-h-[100px] flex items-center justify-center">
          <div className="p-4 border rounded-lg text-center">
            Interactive preview will be available once component code is added
          </div>
        </div>
      </div>
      
      <div className="border border-gray-3 rounded-lg p-4 bg-gray-2">
        <Text size="2" weight="bold" className="mb-3 block">Code</Text>
        <pre className="text-xs bg-gray-1 p-3 rounded border border-gray-4 overflow-x-auto">
          <code>{component.code}</code>
        </pre>
      </div>
    </Box>
  );
};

export default ComponentPreview;
