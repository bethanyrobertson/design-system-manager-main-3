import React, { useState, useEffect } from 'react'
import { Container, Flex, Box, Text, Button } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import { tokensAPI } from '@/lib/api'
import ColorGrid from '@/components/design-tokens/ColorGrid'
import BorderRadius from '@/components/design-tokens/BorderRadius'
import Blur from '@/components/design-tokens/Blur'
import FontSize from '@/components/design-tokens/FontSize'
import Spacing from '@/components/design-tokens/Spacing'

const Tokens = ({ onAddToken }) => {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await tokensAPI.getAll()
        console.log('Tokens response:', response)
        if (response.tokens) {
          setTokens(response.tokens)
        }
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'colors', label: 'Colors' },
    { key: 'typography', label: 'Typography' },
    { key: 'spacing', label: 'Spacing' },
    { key: 'border-radius', label: 'Border Radius' },
    { key: 'blur', label: 'Blur' }
  ]

  if (loading) {
    return (
      <Container size="4" className="py-8">
        <Text>Loading tokens...</Text>
      </Container>
    )
  }

  return (
    <Container size="4" className="py-8">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Box>
            <Text size="8" weight="bold">Design Tokens</Text>
            <br />
            <Text size="3" color="gray">Manage your design system tokens</Text>
          </Box>
          <Button onClick={onAddToken} size="3">
            <PlusIcon />
            Add Token
          </Button>
        </Flex>

        {/* Filter Badges */}
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

        {/* Token Sections */}
        <Flex direction="column" gap="8">
          {(activeFilter === 'all' || activeFilter === 'colors') && (
            <Box id="colors">
              <ColorGrid tokens={tokens.filter(token => token.category === 'color')} />
            </Box>
          )}
          
          {(activeFilter === 'all' || activeFilter === 'typography') && (
            <Box id="typography">
              <FontSize tokens={tokens.filter(token => token.category === 'typography')} />
            </Box>
          )}
          
          {(activeFilter === 'all' || activeFilter === 'spacing') && (
            <Box id="spacing">
              <Spacing tokens={tokens.filter(token => token.category === 'spacing')} />
            </Box>
          )}
          
          {(activeFilter === 'all' || activeFilter === 'border-radius') && (
            <Box id="border-radius">
              <BorderRadius tokens={tokens.filter(token => token.category === 'border-radius')} />
            </Box>
          )}
          
          {(activeFilter === 'all' || activeFilter === 'blur') && (
            <Box id="blur">
              <Blur tokens={tokens.filter(token => token.category === 'blur')} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Container>
  )
}

export default Tokens
