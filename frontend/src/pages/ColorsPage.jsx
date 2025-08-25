import React, { useState, useEffect } from 'react'
import { Container, Flex, Box, Text, Button } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import ColorGrid from '@/components/design-tokens/ColorGrid'
import { tokensAPI } from '@/lib/api'
import AddTokenModal from '@/components/modals/AddTokenModal'
import EditTokenModal from '@/components/modals/EditTokenModal'
import DeleteTokenModal from '@/components/modals/DeleteTokenModal'

export default function ColorsPage() {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingToken, setEditingToken] = useState(null)
  const [deletingToken, setDeletingToken] = useState(null)
  const [error, setError] = useState(null)

  console.log('ColorsPage: Rendering with tokens:', tokens.length, 'loading:', loading, 'error:', error)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        console.log('ColorsPage: Fetching tokens...');
        const response = await tokensAPI.getAll({ limit: 200 });
        console.log('ColorsPage: API response:', response);
        const colorTokens = response.tokens.filter(token => 
          token.category === 'color' || 
          token.type === 'color' ||
          token.name?.includes('pink') ||
          token.value?.startsWith('#')
        );
        console.log('ColorsPage: All tokens:', response.tokens);
        console.log('ColorsPage: Filtered color tokens:', colorTokens);
        setTokens(colorTokens);
        setError(null);
      } catch (error) {
        console.error('ColorsPage: Error fetching tokens:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleAddToken = async (tokenData) => {
    try {
      const newToken = await tokensAPI.create(tokenData);
      const response = await tokensAPI.getAll({ limit: 200 });
      const colorTokens = response.tokens.filter(token => 
        token.category === 'color' || 
        token.type === 'color' ||
        token.name?.includes('pink') ||
        token.value?.startsWith('#')
      );
      setTokens(colorTokens);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding token:', error);
      setError(error.message);
    }
  };

  const handleEditToken = async (tokenData) => {
    try {
      await tokensAPI.update(editingToken._id, tokenData);
      const response = await tokensAPI.getAll({ limit: 200 });
      const colorTokens = response.tokens.filter(token => 
        token.category === 'color' || 
        token.type === 'color' ||
        token.name?.includes('pink') ||
        token.value?.startsWith('#')
      );
      setTokens(colorTokens);
      setEditingToken(null);
    } catch (error) {
      console.error('Error updating token:', error);
      setError(error.message);
    }
  };

  const handleDeleteToken = async () => {
    try {
      await tokensAPI.deleteToken(deletingToken._id);
      setTokens(tokens.filter(token => token._id !== deletingToken._id));
      setDeletingToken(null);
    } catch (error) {
      console.error('Error deleting token:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Container size="4" className="py-8">
        <Text>Loading tokens...</Text>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="4" className="py-8">
        <Text color="red">Error: {error}</Text>
      </Container>
    )
  }

  return (
    <Container size="4" className="py-8">
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center">
          <Box>
            <Text size="8" weight="bold">Colors</Text>
            <Text size="3" color="gray" className="mt-1">
              Design tokens for color values
            </Text>
          </Box>
          <Button onClick={() => setShowAddModal(true)} size="3">
            <PlusIcon />
            Add Token
          </Button>
        </Flex>

        <ColorGrid 
          tokens={tokens} 
          onEdit={setEditingToken}
          onDelete={setDeletingToken}
        />
      </Flex>

      <AddTokenModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddToken}
        defaultCategory="color"
      />

      {editingToken && (
        <EditTokenModal
          isOpen={!!editingToken}
          token={editingToken}
          onClose={() => setEditingToken(null)}
          onSave={handleEditToken}
        />
      )}

      {deletingToken && (
        <DeleteTokenModal
          isOpen={!!deletingToken}
          token={deletingToken}
          onClose={() => setDeletingToken(null)}
          onConfirm={handleDeleteToken}
        />
      )}
    </Container>
  )
}
