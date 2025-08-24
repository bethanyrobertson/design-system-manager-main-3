import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Flex, Box, Text, Button } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import ComponentPreview from '@/components/ComponentPreview'
import { componentsAPI } from '@/lib/api'
import EditComponentModal from '@/components/modals/EditComponentModal'
import DeleteComponentModal from '@/components/modals/DeleteComponentModal'

export default function ComponentPage() {
  const { componentId } = useParams()
  const [component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingComponent, setEditingComponent] = useState(null)
  const [deletingComponent, setDeletingComponent] = useState(null)

  useEffect(() => {
    if (componentId) {
      fetchComponent()
    }
  }, [componentId])

  const fetchComponent = async () => {
    try {
      const response = await componentsAPI.getById(componentId)
      if (response.component) {
        setComponent(response.component)
      }
    } catch (error) {
      console.error('Error fetching component:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditComponent = (component) => {
    setEditingComponent(component)
  }

  const handleDeleteComponent = (component) => {
    setDeletingComponent(component)
  }

  const handleSaveComponent = async (componentData) => {
    try {
      if (editingComponent._id) {
        await componentsAPI.update(editingComponent._id, componentData)
        await fetchComponent()
      }
      setEditingComponent(null)
    } catch (error) {
      console.error('Error saving component:', error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await componentsAPI.delete(deletingComponent._id)
      // Navigate back to components list or dashboard
      window.history.back()
    } catch (error) {
      console.error('Error deleting component:', error)
    }
  }

  if (loading) {
    return (
      <Container size="4" className="py-8">
        <Text>Loading...</Text>
      </Container>
    )
  }

  if (!component) {
    return (
      <Container size="4" className="py-8">
        <Text>Component not found</Text>
      </Container>
    )
  }

  return (
    <Container size="4" className="py-8">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Box>
            <Text size="8" weight="bold">{component.name}</Text>
            <br />
            <Text size="3" color="gray">{component.description || 'Component details'}</Text>
          </Box>
          <Flex gap="2">
            <Button onClick={() => handleEditComponent(component)} variant="soft" size="3">
              Edit
            </Button>
            <Button onClick={() => handleDeleteComponent(component)} variant="soft" color="red" size="3">
              Delete
            </Button>
          </Flex>
        </Flex>

        {/* Component Tags */}
        {component.tags && component.tags.length > 0 && (
          <Flex gap="2" wrap="wrap">
            {component.tags.map((tag, index) => (
              <Box key={index} className="px-3 py-1 bg-gray-3 text-gray-11 text-sm rounded-full">
                {tag}
              </Box>
            ))}
          </Flex>
        )}

        {/* Component Preview */}
        <ComponentPreview component={component} />

        {/* Modals */}
        {editingComponent && (
          <EditComponentModal
            component={editingComponent}
            onSave={handleSaveComponent}
            onClose={() => setEditingComponent(null)}
          />
        )}

        {deletingComponent && (
          <DeleteComponentModal
            component={deletingComponent}
            onConfirm={handleConfirmDelete}
            onClose={() => setDeletingComponent(null)}
          />
        )}
      </Flex>
    </Container>
  )
}
