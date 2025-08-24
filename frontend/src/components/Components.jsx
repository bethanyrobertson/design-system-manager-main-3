import React, { useState, useEffect } from 'react'
import { Container, Flex, Box, Text, Button, Card } from '@radix-ui/themes'
import { PlusIcon, ColorWheelIcon } from '@radix-ui/react-icons'
import { componentsAPI } from '@/lib/api'
import ComponentPreview from '@/components/ComponentPreview'

const Components = ({ onAddComponent }) => {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await componentsAPI.getAll()
        console.log('Components response:', response)
        if (response.components) {
          setComponents(response.components)
        }
      } catch (error) {
        console.error('Error fetching components:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComponents()
  }, [])

  // Get unique tags from components for filter options
  const allTags = [...new Set(components.flatMap(comp => comp.tags || []))]
  const filterOptions = [
    { key: 'all', label: 'All' },
    ...allTags.map(tag => ({ key: tag, label: tag }))
  ]

  // Filter components based on active filter
  const filteredComponents = activeFilter === 'all' 
    ? components 
    : components.filter(comp => comp.tags && comp.tags.includes(activeFilter))

  if (loading) {
    return (
      <Container size="4" className="py-8">
        <Text>Loading components...</Text>
      </Container>
    )
  }

  return (
    <Container size="4" className="py-8">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Box>
            <Text size="8" weight="bold">Components</Text>
            <Text size="3" color="gray">Manage your design system components</Text>
          </Box>
          <Button onClick={onAddComponent} size="3">
            <PlusIcon />
            Add Component
          </Button>
        </Flex>

        {/* Filter Badges */}
        {filterOptions.length > 1 && (
          <Flex gap="2" wrap="wrap">
            {filterOptions.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "solid" : "soft"}
                size="1"
                onClick={() => setActiveFilter(filter.key)}
                style={{ borderRadius: '9999px' }}
              >
                {filter.label}
              </Button>
            ))}
          </Flex>
        )}

        {/* Components Grid */}
        {filteredComponents.length === 0 ? (
          <Card className="p-8 text-center">
            <Flex direction="column" align="center" gap="4">
              <ColorWheelIcon width="48" height="48" />
              <Box>
                <Text size="5" weight="bold">
                  {activeFilter === 'all' ? 'No components yet' : `No components found with tag "${activeFilter}"`}
                </Text>
                <Text size="3" color="gray">
                  {activeFilter === 'all' 
                    ? 'Start building your design system by adding your first component'
                    : 'Try selecting a different filter or add components with this tag'
                  }
                </Text>
              </Box>
              <Button onClick={onAddComponent} size="3">
                <PlusIcon />
                Add Component
              </Button>
            </Flex>
          </Card>
        ) : (
          <Flex direction="column" gap="4">
            {filteredComponents.map((component) => (
              <Card key={component._id} id={component._id} className="p-6">
                <Flex direction="column" gap="4">
                  <Flex justify="between" align="start">
                    <Box>
                      <Text size="5" weight="bold">{component.name}</Text>
                      <Text size="3" color="gray">{component.description}</Text>
                    </Box>
                    <Flex gap="2">
                      <Text size="2" color="gray">v{component.version}</Text>
                    </Flex>
                  </Flex>
                  
                  {component.code && (
                    <ComponentPreview 
                      code={component.code}
                      language={component.language || 'jsx'}
                    />
                  )}
                  
                  {component.tags && component.tags.length > 0 && (
                    <Flex gap="2" wrap="wrap">
                      {component.tags.map((tag, index) => (
                        <Box key={index} className="px-2 py-1 bg-gray-3 rounded-full text-xs">
                          {tag}
                        </Box>
                      ))}
                    </Flex>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </Flex>
    </Container>
  )
}

export default Components
