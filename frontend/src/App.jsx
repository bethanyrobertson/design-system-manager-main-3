import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Theme, Container, Flex, Box, Text, Button, Avatar, DropdownMenu, IconButton } from '@radix-ui/themes'
import { 
  HomeIcon, 
  ColorWheelIcon, 
  CircleIcon, 
  GearIcon, 
  FileTextIcon, 
  PersonIcon,
  ExitIcon,
  SunIcon,
  MoonIcon,
  HamburgerMenuIcon,
  PlusIcon
} from '@radix-ui/react-icons'
import { componentsAPI, tokensAPI } from './lib/api'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import ColorsPage from '@/pages/ColorsPage'
import TypographyPage from '@/pages/TypographyPage'
import SpacingPage from '@/pages/SpacingPage'
import BorderRadiusPage from '@/pages/BorderRadiusPage'
import BlurPage from '@/pages/BlurPage'
import ComponentPage from '@/pages/ComponentPage'
import EditComponentModal from './components/modals/EditComponentModal'
import DeleteComponentModal from './components/modals/DeleteComponentModal'
import EditTokenModal from './components/modals/EditTokenModal'
import DeleteTokenModal from './components/modals/DeleteTokenModal'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }
  return children
}

// Main Layout Component
const AppLayout = ({ children, user, onSignout, currentPage, setCurrentPage, theme, setTheme }) => {
  const location = useLocation()

  useEffect(() => {
    // Update current page based on location
    const path = location.pathname
    if (path === '/') setCurrentPage('dashboard')
    else if (path === '/components') setCurrentPage('components')
    else if (path === '/tokens') setCurrentPage('tokens')
    else if (path === '/documentation') setCurrentPage('documentation')
    else if (path === '/settings') setCurrentPage('settings')
  }, [location, setCurrentPage])

  const getBreadcrumbTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard'
      case 'components': return 'Components'
      case 'tokens': return 'Design Tokens'
      case 'documentation': return 'Documentation'
      case 'settings': return 'Settings'
      default: return 'Dashboard'
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar theme={theme} setTheme={setTheme} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Design System Manager
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Main App Component
function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleSignout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const handleLogin = (userData, token) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  console.log('App render - Auth:', isAuthenticated, 'User:', user, 'Page:', currentPage)

  // Skip authentication for now to debug rendering
  return (
    <Theme accentColor="pink" grayColor="gray" appearance={theme}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/signin" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Signin onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <Dashboard />
              </AppLayout>
            } 
          />
          <Route 
            path="/colors" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <ColorsPage />
              </AppLayout>
            } 
          />
          <Route 
            path="/typography" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <TypographyPage />
              </AppLayout>
            } 
          />
          <Route 
            path="/spacing" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <SpacingPage />
              </AppLayout>
            } 
          />
          <Route 
            path="/border-radius" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <BorderRadiusPage />
              </AppLayout>
            } 
          />
          <Route 
            path="/blur" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <BlurPage />
              </AppLayout>
            } 
          />
          <Route 
            path="/component/:componentId" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <ComponentPage />
              </AppLayout>
            } 
          />
          <Route 
            path="/documentation" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <Documentation />
              </AppLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AppLayout 
                user={user} 
                onSignout={handleSignout}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                setTheme={setTheme}
              >
                <Settings />
              </AppLayout>
            } 
          />
        </Routes>
      </BrowserRouter>
    </Theme>
  )
}

// Page Components
const Dashboard = () => {
  const navigate = useNavigate()
  const [backendStatus, setBackendStatus] = useState('checking')
  const [frontendStatus, setFrontendStatus] = useState('checking')
  const [databaseStatus, setDatabaseStatus] = useState('checking')
  const [apiEndpoints, setApiEndpoints] = useState('checking')

  useEffect(() => {
    // Check backend connection and get detailed status
    fetch('http://localhost:3000/api/health')
      .then(response => response.json())
      .then(data => {
        setBackendStatus('connected')
        setDatabaseStatus(data.database === 'connected' ? 'connected' : 'disconnected')
        setApiEndpoints('available')
      })
      .catch(() => {
        setBackendStatus('disconnected')
        setDatabaseStatus('disconnected')
        setApiEndpoints('unavailable')
      })

    // Check frontend
    setFrontendStatus('running')
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'running':
      case 'available':
        return <Box className="w-3 h-3 bg-green-500 rounded-full" />
      case 'disconnected':
      case 'error':
      case 'unavailable':
        return <Box className="w-3 h-3 bg-red-500 rounded-full" />
      default:
        return <Box className="w-3 h-3 bg-yellow-500 rounded-full" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'running':
        return 'Running'
      case 'available':
        return 'Available'
      case 'disconnected':
        return 'Disconnected'
      case 'error':
        return 'Error'
      case 'unavailable':
        return 'Unavailable'
      default:
        return 'Checking...'
    }
  }

  console.log('Dashboard render - Backend:', backendStatus, 'Frontend:', frontendStatus)

  return (
    <Box>
      <Text size="8" weight="bold" className="mb-6">Dashboard</Text>
      
      <Flex direction="column" gap="6">
        <Box className="p-6 bg-card border border-border rounded-lg">
          <Text size="5" weight="semibold" className="mb-4">System Status</Text>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              {getStatusIcon(frontendStatus)}
              <Text size="3">React Frontend</Text>
              <Text size="2" color="gray">({getStatusText(frontendStatus)})</Text>
            </Flex>
            <Flex align="center" gap="3">
              {getStatusIcon(backendStatus)}
              <Text size="3">Node.js API Server</Text>
              <Text size="2" color="gray">({getStatusText(backendStatus)})</Text>
            </Flex>
            <Flex align="center" gap="3">
              {getStatusIcon(databaseStatus)}
              <Text size="3">MongoDB Database</Text>
              <Text size="2" color="gray">({getStatusText(databaseStatus)})</Text>
            </Flex>
            <Flex align="center" gap="3">
              {getStatusIcon(apiEndpoints)}
              <Text size="3">REST API Endpoints</Text>
              <Text size="2" color="gray">({getStatusText(apiEndpoints)})</Text>
            </Flex>
          </Flex>
        </Box>

        <Box className="p-6 bg-card border border-border rounded-lg">
          <Text size="5" weight="semibold" className="mb-4">Quick Actions</Text>
          <Flex gap="3" wrap="wrap">
            <Button variant="solid" size="3" onClick={() => navigate('/components')}>
              <ColorWheelIcon className="w-4 h-4 mr-2" />
              View Components
            </Button>
            <Button variant="outline" size="3" onClick={() => navigate('/tokens')}>
              <CircleIcon className="w-4 h-4 mr-2" />
              Manage Tokens
            </Button>
            <Button variant="outline" size="3" onClick={() => navigate('/documentation')}>
              <FileTextIcon className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

const Components = () => {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState(null)

  // Get unique tags from all components for filter options
  const getFilterOptions = () => {
    const allTags = components.flatMap(component => component.tags || [])
    const uniqueTags = [...new Set(allTags)]
    return [
      { key: 'all', label: 'All' },
      ...uniqueTags.map(tag => ({ key: tag, label: tag }))
    ]
  }

  const filteredComponents = activeFilter === 'all' 
    ? components 
    : components.filter(component => 
        component.tags && component.tags.includes(activeFilter)
      )

  const fetchComponents = async () => {
    try {
      setLoading(true)
      const response = await componentsAPI.getAll()
      console.log('Components API response:', response)
      
      if (response.components) {
        setComponents(response.components)
      } else {
        setError('Failed to fetch components')
      }
    } catch (err) {
      console.error('Error fetching components:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComponents()
  }, [])

  console.log('Components render - Loading:', loading, 'Count:', components.length, 'Error:', error)

  if (loading) {
    return (
      <Box>
        <Text size="8" weight="bold" className="mb-6">Components</Text>
        <Text>Loading components...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Text size="8" weight="bold" className="mb-6">Components</Text>
        <Text color="red">Error: {error}</Text>
      </Box>
    )
  }

  const filterOptions = getFilterOptions()

  return (
    <Box className="space-y-6">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4">
        <Flex justify="between" align="center" className="mb-4">
          <Text size="8" weight="bold">Components</Text>
          <Button 
            variant="solid" 
            size="3" 
            className="inline-flex items-center gap-1"
            onClick={() => {
              setSelectedComponent(null)
              setShowEditModal(true)
            }}
          >
            <PlusIcon className="w-4 h-4" />
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
      </div>

      {filteredComponents.length === 0 ? (
        <Box className="p-8 text-center bg-gray-1">
          <Text size="4" color="gray">
            {activeFilter === 'all' ? 'No components found' : `No components found with tag "${activeFilter}"`}
          </Text>
        </Box>
      ) : (
        <Flex direction="column" gap="4">
          {filteredComponents.map((component) => (
            <Box key={component._id} id={component._id} className="p-6 border rounded-lg bg-card">
              <Flex direction="column" gap="4">
                <Box>
                  <Text size="5" weight="bold">{component.name}</Text>
                  {component.description && (
                    <Text size="3" color="gray" className="mt-1">{component.description}</Text>
                  )}
                  {component.tags && component.tags.length > 0 && (
                    <Flex gap="2" className="mt-2">
                      {component.tags.map((tag, index) => (
                        <Box key={index} className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs">
                          {tag}
                        </Box>
                      ))}
                    </Flex>
                  )}
                </Box>
                
                
                <Flex gap="2">
                  <EditComponentModal component={component} onUpdate={fetchComponents}>
                    <Button variant="outline" size="2" className="inline-flex items-center">Edit</Button>
                  </EditComponentModal>
                  <DeleteComponentModal component={component} onDelete={fetchComponents}>
                    <Button variant="outline" size="2" color="red" className="inline-flex items-center">Delete</Button>
                  </DeleteComponentModal>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}

      {/* Modals */}
        <EditComponentModal 
          component={selectedComponent} 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchComponents}
        />
        <DeleteComponentModal 
          component={selectedComponent}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={fetchComponents}
        />
      </Box>
    )
}

const DesignTokens = () => {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState(null)

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'colors', label: 'Colors' },
    { key: 'typography', label: 'Typography' },
    { key: 'spacing', label: 'Spacing' },
    { key: 'border-radius', label: 'Border Radius' },
    { key: 'blur', label: 'Blur' }
  ]

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true)
        const response = await tokensAPI.getAll()
        console.log('Tokens API response:', response)
        
        if (response.tokens) {
          setTokens(response.tokens)
        } else {
          setError('Failed to fetch tokens')
        }
      } catch (err) {
        console.error('Error fetching tokens:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Text size="8" weight="bold">Design Tokens</Text>
        </div>
        <Text>Loading tokens...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Text size="8" weight="bold">Design Tokens</Text>
        </div>
        <Text color="red">Error: {error}</Text>
      </div>
    )
  }

  // Group tokens by category
  const colorTokens = tokens.filter(token => token.category === 'color');
  const typographyTokens = tokens.filter(token => token.category === 'typography');
  const spacingTokens = tokens.filter(token => token.category === 'spacing');

  return (
    <div className="space-y-8">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Text size="8" weight="bold">Design Tokens</Text>
          <Button 
            variant="solid" 
            size="3" 
            className="inline-flex items-center gap-1"
            onClick={() => {
              setSelectedToken(null)
              setShowEditModal(true)
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Token
          </Button>
        </div>
        
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
      </div>

      {(activeFilter === 'all' || activeFilter === 'colors') && colorTokens.length > 0 && (
        <div id="colors" className="space-y-4">
          <ColorGrid tokens={colorTokens} />
        </div>
      )}

      {(activeFilter === 'all' || activeFilter === 'typography') && typographyTokens.length > 0 && (
        <div id="typography" className="space-y-4">
          <FontSize tokens={typographyTokens} />
        </div>
      )}

      {(activeFilter === 'all' || activeFilter === 'spacing') && spacingTokens.length > 0 && (
        <div id="spacing" className="space-y-4">
          <Spacing tokens={spacingTokens} />
        </div>
      )}

      {(activeFilter === 'all' || activeFilter === 'border-radius') && (
        <div id="border-radius" className="space-y-4">
          <BorderRadius />
        </div>
      )}

      {(activeFilter === 'all' || activeFilter === 'blur') && (
        <div id="blur" className="space-y-4">
          <Blur />
        </div>
      )}

      {activeFilter === 'all' && tokens.filter(token => !['color', 'typography', 'spacing'].includes(token.category)).length > 0 && (
        <div className="space-y-4">
          <Text size="6" weight="bold">Custom Tokens</Text>
          <Flex direction="column" gap="4">
            {tokens.filter(token => !['color', 'typography', 'spacing'].includes(token.category)).map((token) => (
              <Box key={token._id} id={token._id} className="p-4 border rounded-lg bg-card">
                <Flex direction="column" gap="2">
                  <Box>
                    <Text size="4" weight="bold">{token.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
                    {token.description && (
                      <Text size="2" color="gray" className="mt-1">{token.description}</Text>
                    )}
                    <Text size="2" className="mt-1">
                      <strong>Type:</strong> {token.type} | <strong>Value:</strong> {token.value}
                    </Text>
                  </Box>
                  <Flex gap="2">
                    <EditTokenModal token={token} onUpdate={() => fetchTokens()}>
                      <Button variant="outline" size="2" className="inline-flex items-center">Edit</Button>
                    </EditTokenModal>
                    <DeleteTokenModal token={token} onDelete={() => fetchTokens()}>
                      <Button variant="outline" size="2" color="red" className="inline-flex items-center">Delete</Button>
                    </DeleteTokenModal>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Flex>
        </div>
      )}

      {tokens.length === 0 && (
        <div className="p-8 text-center">
          <Text size="4" color="gray">No tokens found</Text>
        </div>
      )}

      {/* Modals */}
      <EditTokenModal 
        token={selectedToken} 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={() => {
          fetchTokens()
          setShowEditModal(false)
        }}
      />
      <DeleteTokenModal 
        token={selectedToken}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => {
          fetchTokens()
          setShowDeleteModal(false)
        }}
      />
    </div>
  )
}

const Documentation = () => {
  return (
    <Container size="4" className="py-8">
      <Flex direction="column" gap="6">
        {/* Hero Header */}
        <div className="h-64 bg-[#1d1d20] dark:bg-gray-12 rounded-2xl relative overflow-hidden">
          <Flex className="h-full relative z-10">
            {/* Text Block */}
            <div className="w-1/2 flex flex-col justify-center p-8">
              <Text size="9" weight="bold" className="text-[#fcfcfd] dark:text-gray-12 mb-2 block">Documentation</Text>
              <Text size="4" className="text-[#fcfcfd] dark:text-gray-11">
                Complete guides and resources for implementing and using the design system effectively
              </Text>
            </div>
            {/* Visual Block */}
            <Box className="flex-1 relative rounded-r-2xl overflow-hidden h-full">
              <img 
                src="https://imagedelivery.net/N-MD9o_LYLdDJqNonHl96g/0c8369e2-2e3d-419c-f08a-7e4978e28400/public"
                alt="Documentation illustration"
                className="w-full h-full object-cover"
              />
            </Box>
          </Flex>
        </div>

        <div className="space-y-8">
          {/* Overview Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Design System Overview</h2>
            <p className="text-muted-foreground">
              This design system provides a comprehensive set of components, design tokens, and guidelines 
              to ensure consistency across all applications and interfaces.
            </p>
          </div>

          {/* Getting Started */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-medium mb-2">Installation</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">npm install @company/design-system</code>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
{`import { Button, Card } from '@company/design-system'

function App() {
  return (
    <Card>
      <Button variant="primary">Get Started</Button>
    </Card>
  )
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Components Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Button</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive element for user actions with multiple variants and sizes.
                </p>
                <div className="flex gap-2">
                  <Button size="2" variant="solid">Primary</Button>
                  <Button size="2" variant="outline">Secondary</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Card</h3>
                <p className="text-sm text-muted-foreground">
                  Container component for grouping related content with consistent styling.
                </p>
                <div className="bg-card border rounded p-3 text-sm">
                  Sample card content
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Input</h3>
                <p className="text-sm text-muted-foreground">
                  Form input elements with validation states and consistent styling.
                </p>
                <input 
                  className="w-full px-3 py-2 border rounded text-sm" 
                  placeholder="Sample input"
                />
              </div>
            </div>
          </div>

          {/* Design Tokens Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Design Tokens</h2>
            <p className="text-muted-foreground">
              Design tokens are the visual design atoms of the design system. They store visual design 
              attributes like colors, typography, spacing, and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Colors</h3>
                <p className="text-sm text-muted-foreground">
                  Semantic color palette including primary, secondary, and state colors.
                </p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-primary rounded"></div>
                  <div className="w-8 h-8 bg-secondary rounded"></div>
                  <div className="w-8 h-8 bg-accent rounded"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Typography</h3>
                <p className="text-sm text-muted-foreground">
                  Font sizes, weights, and line heights for consistent text hierarchy.
                </p>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">Heading 1</div>
                  <div className="text-lg font-semibold">Heading 2</div>
                  <div className="text-base">Body text</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Guidelines</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Accessibility</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>All components meet WCAG 2.1 AA standards</li>
                  <li>Color contrast ratios exceed 4.5:1 for normal text</li>
                  <li>Keyboard navigation is supported throughout</li>
                  <li>Screen reader compatible with proper ARIA labels</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Use semantic HTML elements when possible</li>
                  <li>Follow the established spacing scale for layouts</li>
                  <li>Maintain consistent component usage patterns</li>
                  <li>Test components across different screen sizes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Figma Library</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Access design files and component specifications
                </p>
                <Button size="2" variant="outline">View in Figma</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">GitHub Repository</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Source code, issues, and contribution guidelines
                </p>
                <Button size="2" variant="outline">View Repository</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Changelog</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Latest updates and version history
                </p>
                <Button size="2" variant="outline">View Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </Flex>
    </Container>
  )
}

const Settings = () => {
  return (
    <Box>
      <Text size="8" weight="bold" className="mb-6">Settings</Text>
      <Text size="4" className="mb-4">Manage your account and application settings.</Text>
      <Text>Settings configuration will be available here.</Text>
    </Box>
  )
}

const Signin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.user, data.token)
        navigate('/')
      } else {
        setError(data.message || 'Authentication failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="min-h-screen flex items-center justify-center bg-background">
      <Box className="w-full max-w-md p-8 bg-card border border-border rounded-lg">
        <Text size="6" weight="bold" className="text-center mb-6">
          {isLogin ? 'Sign In' : 'Create Account'}
        </Text>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Box>
              <Text size="2" weight="medium" className="mb-2 block">Name</Text>
              <div className="border rounded-lg p-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            </Box>
          )}

          <Box>
            <Text size="2" weight="medium" className="mb-2 block">Email</Text>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-border rounded-md bg-background text-foreground"
              placeholder="Enter your email"
              required
            />
          </Box>

          <Box>
            <Text size="2" weight="medium" className="mb-2 block">Password</Text>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-border rounded-md bg-background text-foreground"
              placeholder="Enter your password"
              required
            />
          </Box>

          {error && (
            <Text color="red" size="2" className="text-center">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            variant="solid"
            size="3"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <Separator className="my-6" />

        <Button
          variant="ghost"
          size="2"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </Button>
      </Box>
    </Box>
  )
}

export default App
