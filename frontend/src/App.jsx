import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Container, Box, Flex, Text, Button, Heading } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'

// Import pages
import ColorsPage from '@/pages/ColorsPage'
import SpacingPage from '@/pages/SpacingPage'
import BorderRadiusPage from '@/pages/BorderRadiusPage'
import BlurPage from '@/pages/BlurPage'

// Breadcrumb Component
function DynamicBreadcrumb() {
  const location = useLocation()
  
  const getBreadcrumbs = () => {
    const path = location.pathname
    
    if (path === '/colors') return [{ label: 'Tokens', href: '/colors' }, { label: 'Colors' }]
    if (path === '/spacing') return [{ label: 'Tokens', href: '/colors' }, { label: 'Spacing' }]
    if (path === '/border-radius') return [{ label: 'Tokens', href: '/colors' }, { label: 'Border Radius' }]
    if (path === '/blur') return [{ label: 'Tokens', href: '/colors' }, { label: 'Blur' }]
    
    return [{ label: 'Dashboard' }]
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem className="hidden md:block">
              {crumb.href ? (
                <BreadcrumbLink href={crumb.href}>
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// App Layout Component
function AppLayout({ children, user, onSignout, currentPage, setCurrentPage, theme, setTheme }) {
  return (
    <SidebarProvider>
      <AppSidebar 
        user={user}
        onSignout={onSignout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        setTheme={setTheme}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
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
export default function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  const [currentPage, setCurrentPage] = useState('Dashboard')

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userData.token)
  }

  const handleSignout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route 
            path="/" 
            element={
              <Navigate to="/colors" replace />
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
        </Routes>
      </div>
    </Router>
  )
}
