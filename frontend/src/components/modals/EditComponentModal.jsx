import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@radix-ui/themes'
import { componentsAPI } from '@/lib/api'
import CodeEditor from '@/components/CodeEditor'

const EditComponentModal = ({ component, onUpdate, children }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [formData, setFormData] = useState({
    name: component.name || '',
    description: component.description || '',
    tags: component.tags ? component.tags.join(', ') : '',
    code: component.code || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedComponent = {
        ...component,
        name: formData.name,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        code: formData.code
      }

      await componentsAPI.update(component._id, updatedComponent)
      onUpdate()
      setOpen(false)
    } catch (error) {
      console.error('Error updating component:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCodeSave = (code) => {
    setFormData(prev => ({ ...prev, code }))
    setShowCodeEditor(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-gray-1 dark:bg-gray-12 border border-gray-6 dark:border-gray-8">
        <DialogHeader>
          <DialogTitle className="text-gray-12 dark:text-gray-1">Edit Component</DialogTitle>
        </DialogHeader>
        
        {showCodeEditor ? (
          <CodeEditor
            initialCode={formData.code}
            onSave={handleCodeSave}
            onCancel={() => setShowCodeEditor(false)}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-11 dark:text-gray-3 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-6 dark:border-gray-8 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-11 dark:text-gray-3 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-6 dark:border-gray-8 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-11 dark:text-gray-3 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="button, primary, interactive"
                className="w-full px-3 py-2 border border-gray-6 dark:border-gray-8 rounded-md bg-gray-1 dark:bg-gray-12 text-gray-12 dark:text-gray-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-11 dark:text-gray-3 mb-1">
                Component Code
              </label>
              <div className="flex gap-2 items-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCodeEditor(true)}
                >
                  {formData.code ? 'Edit Code' : 'Add Code'}
                </Button>
                {formData.code && (
                  <span className="text-sm text-gray-9">Code added</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditComponentModal
