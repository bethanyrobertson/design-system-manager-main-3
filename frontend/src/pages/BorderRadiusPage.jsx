import React, { useState, useEffect } from 'react'
import { Container, Flex, Box, Text, Button } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import BorderRadius from '@/components/design-tokens/BorderRadius'
import { tokensAPI } from '@/lib/api'
import AddTokenModal from '@/components/modals/AddTokenModal'
import EditTokenModal from '@/components/modals/EditTokenModal'
import DeleteTokenModal from '@/components/modals/DeleteTokenModal'

export default function BorderRadiusPage() {
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
        const borderRadiusTokens = response.tokens.filter(token => token.type === 'border-radius')
        setTokens(borderRadiusTokens)
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
              <Text size="9" weight="bold" className="text-[#fcfcfd] dark:text-gray-12 mb-2 block">Border Radius</Text>
              <Text size="4" className="text-[#fcfcfd] dark:text-gray-11">
                Border radius tokens define consistent corner rounding for UI elements across your design system
              </Text>
            </div>
            {/* Visual Block */}
            <Box className="flex-1 relative rounded-r-2xl overflow-hidden h-full">
              <img 
                src="https://imagedelivery.net/N-MD9o_LYLdDJqNonHl96g/00741131-c935-439c-e3c9-aef4ee4bcb00/public"
                alt="Border radius illustration"
                className="w-full h-full object-cover"
              />
            </Box>
          </Flex>
        </div>

        {/* Action Header */}
        <Flex justify="end" align="center">
          <Button onClick={handleAddToken} size="3">
            <PlusIcon />
            Add Border Radius Token
          </Button>
        </Flex>

        {/* Border Radius Component */}
        <BorderRadius 
          tokens={tokens} 
          onEdit={handleEditToken}
          onDelete={handleDeleteToken}
        />

        {/* Modals */}
        <AddTokenModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={fetchTokens}
          tokenType="border-radius"
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
