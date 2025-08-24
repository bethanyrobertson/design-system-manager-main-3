import React, { useState, useEffect } from 'react'
import { Container, Flex, Box, Text, Button } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import Spacing from '@/components/design-tokens/Spacing'
import { tokensAPI } from '@/lib/api'
import AddTokenModal from '@/components/modals/AddTokenModal'
import EditTokenModal from '@/components/modals/EditTokenModal'
import DeleteTokenModal from '@/components/modals/DeleteTokenModal'

export default function SpacingPage() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingToken, setEditingToken] = useState(null)
  const [deletingToken, setDeletingToken] = useState(null)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const response = await tokensAPI.getAll()
      if (response.tokens) {
        const spacingTokens = response.tokens.filter(token => token.type === 'spacing')
        setTokens(spacingTokens)
      }
    } catch (error) {
      console.error('Error fetching tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToken = () => {
    setShowAddModal(true)
  }

  const handleEditToken = (token) => {
    setEditingToken(token)
  }

  const handleDeleteToken = (token) => {
    setDeletingToken(token)
  }

  const handleSaveToken = async (tokenData) => {
    try {
      if (editingToken._id) {
        await tokensAPI.update(editingToken._id, tokenData)
      } else {
        await tokensAPI.create(tokenData)
      }
      await fetchTokens()
      setEditingToken(null)
    } catch (error) {
      console.error('Error saving token:', error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await tokensAPI.delete(deletingToken._id)
      await fetchTokens()
      setDeletingToken(null)
    } catch (error) {
      console.error('Error deleting token:', error)
    }
  }

  if (loading) {
    return (
      <Container size="4" className="py-8">
        <Text>Loading...</Text>
      </Container>
    )
  }

  return (
    <Container size="4" className="py-8">
      <Flex direction="column" gap="6">
        {/* Hero Header */}
        <div className="h-64 bg-[#1d1d20] dark:bg-gray-12 rounded-2xl relative overflow-hidden">
          <Flex className="h-full relative z-10">
            {/* Text Block */}
            <div className="w-1/2 flex flex-col justify-center p-8">
              <Text size="9" weight="bold" className="text-[#fcfcfd] dark:text-gray-12 mb-2 block">Spacing</Text>
              <Text size="4" className="text-[#fcfcfd] dark:text-gray-11">
                Spacing tokens create consistent rhythm and layout patterns across your design system
              </Text>
            </div>
            {/* Visual Block */}
            <Box className="flex-1 relative rounded-r-2xl overflow-hidden h-full">
              <img 
                src="https://imagedelivery.net/N-MD9o_LYLdDJqNonHl96g/b129333b-2bda-47b4-3df9-76f34286fa00/public"
                alt="Spacing illustration"
                className="w-full h-full object-cover"
              />
            </Box>
          </Flex>
        </div>

        {/* Action Header */}
        <Flex justify="end" align="center">
          <Button onClick={handleAddToken} size="3">
            <PlusIcon />
            Add Spacing Token
          </Button>
        </Flex>

        {/* Spacing Component */}
        <Spacing 
          tokens={tokens} 
          onEdit={handleEditToken}
          onDelete={handleDeleteToken}
        />

        {/* Modals */}
        <AddTokenModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={fetchTokens}
          tokenType="spacing"
        />

        {editingToken && (
          <EditTokenModal
            token={editingToken}
            onSave={handleSaveToken}
            onClose={() => setEditingToken(null)}
          />
        )}

        {deletingToken && (
          <DeleteTokenModal
            token={deletingToken}
            onConfirm={handleConfirmDelete}
            onClose={() => setDeletingToken(null)}
          />
        )}
      </Flex>
    </Container>
  )
}
