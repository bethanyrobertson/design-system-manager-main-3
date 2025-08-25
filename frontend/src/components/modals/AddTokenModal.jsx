import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button, TextArea, Text } from '@radix-ui/themes';
import { tokensAPI } from '@/lib/api';

// Success toast component
const SuccessToast = ({ show, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-in fade-in duration-300">
      {message}
    </div>
  );
};

export default function AddTokenModal({ isOpen, onClose, onSave, tokenType }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: tokenType || '',
    value: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setLoading(true);
    
    try {
      const newToken = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        category: formData.category
      };
      
      console.log('Creating token:', newToken);
      const result = await tokensAPI.create(newToken);
      console.log('Token created successfully:', result);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      onSave();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: tokenType || '',
        value: '',
        category: ''
      });
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Error creating token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderByType = (type) => {
    switch (type) {
      case 'color':
        return '#000000, rgb(255,255,255), hsl(0,0%,100%)';
      case 'spacing':
        return '16px, 1rem, 2em';
      case 'typography':
        return '16px, 1.5rem, bold';
      case 'border-radius':
        return '4px, 0.25rem, 50%';
      case 'blur':
        return '4px, 8px, 16px';
      default:
        return 'Enter token value';
    }
  };

  return (
    <>
      <SuccessToast 
        show={showSuccess} 
        message="Token created successfully!" 
        onClose={() => setShowSuccess(false)} 
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Token</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Text size="2" weight="medium" className="block mb-2">Name</Text>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1 focus:outline-none focus:ring-2 focus:ring-pink-8"
                placeholder="Token name"
                required
              />
            </div>
            <div>
              <Text size="2" weight="medium" className="block mb-2">Description</Text>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the token's purpose"
                rows={2}
                className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1 focus:outline-none focus:ring-2 focus:ring-pink-8 resize-none"
              />
            </div>
            <div>
              <Text size="2" weight="medium" className="block mb-2">Type</Text>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 pr-8 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1 focus:outline-none focus:ring-2 focus:ring-pink-8 appearance-none"
                  required
                >
                  <option value="">Select type</option>
                  <option value="color">Color</option>
                  <option value="spacing">Spacing</option>
                  <option value="typography">Typography</option>
                  <option value="border-radius">Border Radius</option>
                  <option value="blur">Blur</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <Text size="2" weight="medium" className="block mb-2">Value</Text>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1 focus:outline-none focus:ring-2 focus:ring-pink-8"
                placeholder={getPlaceholderByType(formData.type)}
                required
              />
            </div>
            <div>
              <Text size="2" weight="medium" className="block mb-2">Category</Text>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1 focus:outline-none focus:ring-2 focus:ring-pink-8"
                placeholder="Category (optional)"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="soft" 
                size="3"
                onClick={onClose}
              >
                Cancel
              </Button>
              <button 
                type="submit" 
                className="bg-[#d6409f] hover:bg-[#c2298a] text-white px-6 py-3 rounded-xl text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Token'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
