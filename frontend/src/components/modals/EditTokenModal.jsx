import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@radix-ui/themes';
import { tokensAPI } from '@/lib/api';

export default function EditTokenModal({ token, onUpdate, children }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    value: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setFormData({
        name: token.name || '',
        description: token.description || '',
        type: token.type || '',
        value: token.value || '',
        category: token.category || ''
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedToken = {
        ...token,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        category: formData.category
      };
      
      await tokensAPI.update(token._id, updatedToken);
      onUpdate();
      setOpen(false);
    } catch (error) {
      console.error('Error updating token:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Token</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
              required
            >
              <option value="">Select type</option>
              <option value="color">Color</option>
              <option value="spacing">Spacing</option>
              <option value="typography">Typography</option>
              <option value="border">Border</option>
              <option value="shadow">Shadow</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Value</label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
              placeholder="#000000, 16px, 1rem, etc."
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-6 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
              placeholder="primary, secondary, etc."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="solid"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
