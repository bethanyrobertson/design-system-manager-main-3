import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Theme, Container, Flex, Box, Text, Button, Separator, Avatar, DropdownMenu, IconButton } from '@radix-ui/themes'
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
  HamburgerMenuIcon
} from '@radix-ui/react-icons'
import { componentsAPI, tokensAPI } from './lib/api'
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
  const navigate = useNavigate()
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, path: '/' },
    { id: 'components', label: 'Components', icon: ColorWheelIcon, path: '/components' },
    { id: 'tokens', label: 'Design Tokens', icon: CircleIcon, path: '/tokens' },
    { id: 'documentation', label: 'Documentation', icon: FileTextIcon, path: '/documentation' },
    { id: 'settings', label: 'Settings', icon: GearIcon, path: '/settings' }
  ]

  const handleNavClick = (path) => {
    navigate(path)
  }

  return (
    <Flex className="min-h-screen bg-background">
      {/* Sidebar */}
      <Box className="w-64 bg-sidebar border-r border-border p-4">
        <Flex direction="column" className="h-full">
          {/* Logo */}
          <Box className="mb-8">
            <Text size="6" weight="bold" className="text-primary">
              Design System
            </Text>
          </Box>

          {/* Navigation */}
          <Flex direction="column" gap="2" className="flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "solid" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => handleNavClick(item.path)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              )
            })}
          </Flex>

          {/* User Section */}
          <Box className="mt-auto">
            <Separator className="mb-4" />
            <Flex align="center" justify="between" className="mb-4">
              <Flex align="center" gap="3">
                <Avatar size="2" fallback={user?.name?.[0] || 'U'} />
                <Box>
                  <Text size="2" weight="medium">{user?.name || 'User'}</Text>
                  <Text size="1" color="gray">{user?.email || 'user@example.com'}</Text>
                </Box>
              </Flex>
            </Flex>
            
            {/* Theme Toggle */}
            <Flex gap="2" className="mb-4">
              <Button
                variant="ghost"
                size="2"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full"
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </Button>
            </Flex>

            {/* Sign Out */}
            <Button
              variant="ghost"
              size="2"
              onClick={onSignout}
              className="w-full text-destructive hover:text-destructive"
            >
              <ExitIcon className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </Box>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box className="flex-1 overflow-auto">
        <Container className="p-8">
          {children}
        </Container>
      </Box>
    </Flex>
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
              <ProtectedRoute isAuthenticated={isAuthenticated}>
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
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/components" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AppLayout 
                  user={user} 
                  onSignout={handleSignout}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  theme={theme}
                  setTheme={setTheme}
                >
                  <Components />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tokens" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AppLayout 
                  user={user} 
                  onSignout={handleSignout}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  theme={theme}
                  setTheme={setTheme}
                >
                  <Tokens />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documentation" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
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
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
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
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </Theme>
  )
}

// Page Components
const Dashboard = () => {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [frontendStatus, setFrontendStatus] = useState('checking')

  useEffect(() => {
    // Check backend connection
    fetch('http://localhost:3000/api/health')
      .then(response => {
        if (response.ok) {
          setBackendStatus('connected')
        } else {
          setBackendStatus('error')
        }
      })
      .catch(() => setBackendStatus('disconnected'))

    // Check frontend
    setFrontendStatus('running')
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'running':
        return <Box className="w-3 h-3 bg-green-500 rounded-full" />
      case 'disconnected':
      case 'error':
        return <Box className="w-3 h-3 bg-red-500 rounded-full" />
      default:
        return <Box className="w-3 h-3 bg-yellow-500 rounded-full" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
      case 'running':
        return 'Connected'
      case 'disconnected':
      case 'error':
        return 'Disconnected'
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
              {getStatusIcon(backendStatus)}
              <Text size="3">Backend API</Text>
              <Text size="2" color="gray">({getStatusText(backendStatus)})</Text>
            </Flex>
            <Flex align="center" gap="3">
              {getStatusIcon(frontendStatus)}
              <Text size="3">Frontend</Text>
              <Text size="2" color="gray">({getStatusText(frontendStatus)})</Text>
            </Flex>
          </Flex>
        </Box>

        <Box className="p-6 bg-card border border-border rounded-lg">
          <Text size="5" weight="semibold" className="mb-4">Quick Actions</Text>
          <Flex gap="3" wrap="wrap">
            <Button variant="solid" size="3">
              <ColorWheelIcon className="w-4 h-4 mr-2" />
              View Components
            </Button>
            <Button variant="outline" size="3">
              <CircleIcon className="w-4 h-4 mr-2" />
              Manage Tokens
            </Button>
            <Button variant="outline" size="3">
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

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true)
        const response = await componentsAPI.getAll()
        console.log('Components API response:', response)
        
        if (response.success && response.data && response.data.components) {
          setComponents(response.data.components)
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

  return (
    <Box>
      <Flex align="center" justify="between" className="mb-6">
        <Text size="8" weight="bold">Components</Text>
        <Button variant="solid" size="3">
          <ColorWheelIcon className="w-4 h-4 mr-2" />
          Add Component
        </Button>
      </Flex>

      {components.length === 0 ? (
        <Box className="p-8 text-center">
          <Text size="4" color="gray">No components found</Text>
        </Box>
      ) : (
        <Flex direction="column" gap="4">
          {components.map((component) => (
            <Box key={component._id} className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
              <Flex align="center" justify="between">
                <Box>
                  <Text size="4" weight="semibold">{component.name}</Text>
                  <Text size="2" color="gray" className="mt-1">{component.description}</Text>
                  {component.tags && component.tags.length > 0 && (
                    <Flex gap="2" className="mt-2">
                      {component.tags.map((tag, index) => (
                        <Box key={index} className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                          {tag}
                        </Box>
                      ))}
                    </Flex>
                  )}
                </Box>
                <Flex gap="2">
                  <Button variant="outline" size="2">Edit</Button>
                  <Button variant="outline" size="2" color="red">Delete</Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  )
}

const Tokens = () => {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true)
        const response = await tokensAPI.getAll()
        console.log('Tokens API response:', response)
        
        if (response.success && response.data && response.data.tokens) {
          setTokens(response.data.tokens)
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

  console.log('Tokens render - Loading:', loading, 'Count:', tokens.length, 'Error:', error)

  if (loading) {
    return (
      <Box>
        <Text size="8" weight="bold" className="mb-6">Design Tokens</Text>
        <Text>Loading tokens...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Text size="8" weight="bold" className="mb-6">Design Tokens</Text>
        <Text color="red">Error: {error}</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Flex align="center" justify="between" className="mb-6">
        <Text size="8" weight="bold">Design Tokens</Text>
        <Button variant="solid" size="3">
          <CircleIcon className="w-4 h-4 mr-2" />
          Add Token
        </Button>
      </Flex>

      {tokens.length === 0 ? (
        <Box className="p-8 text-center">
          <Text size="4" color="gray">No tokens found</Text>
        </Box>
      ) : (
        <Flex direction="column" gap="4">
          {tokens.map((token) => (
            <Box key={token._id} className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
              <Flex align="center" justify="between">
                <Box>
                  <Text size="4" weight="semibold">{token.name}</Text>
                  <Text size="2" color="gray" className="mt-1">{token.description}</Text>
                  <Flex align="center" gap="3" className="mt-2">
                    <Text size="2" color="gray">Type: {token.type}</Text>
                    <Text size="2" color="gray">Value: {token.value}</Text>
                    {token.category && (
                      <Box className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                        {token.category}
                      </Box>
                    )}
                  </Flex>
                </Box>
                <Flex gap="2">
                  <Button variant="outline" size="2">Edit</Button>
                  <Button variant="outline" size="2" color="red">Delete</Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  )
}

const Documentation = () => {
  return (
    <Box>
      <Text size="8" weight="bold" className="mb-6">Documentation</Text>
      <Text size="4" className="mb-4">Welcome to the Design System documentation.</Text>
      <Text>This section will contain comprehensive documentation for all components and design tokens.</Text>
    </Box>
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
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                placeholder="Enter your name"
                required={!isLogin}
              />
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
