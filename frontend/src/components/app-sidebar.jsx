import * as React from "react"
import {
  HomeIcon,
  ColorWheelIcon,
  CircleIcon,
  GearIcon,
  FileTextIcon,
  SunIcon,
  MoonIcon,
  Component1Icon,
  TokensIcon,
  DashboardIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { componentsAPI, tokensAPI } from '@/lib/api'

// Design System Manager data
const baseData = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Vector Design System",
      logo: ColorWheelIcon,
      plan: "Manager",
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }) {
  const navigate = useNavigate()
  const [theme, setTheme] = React.useState('light')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  const [isSearching, setIsSearching] = React.useState(false)

  // Search function
  const handleSearch = React.useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await tokensAPI.search(query)
      setSearchResults(response)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, handleSearch])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [componentsResponse, tokensResponse] = await Promise.all([
          componentsAPI.getAll(),
          tokensAPI.getAll()
        ])
        
        if (componentsResponse.components) {
          setComponents(componentsResponse.components)
        }
        if (tokensResponse.tokens) {
          setTokens(tokensResponse.tokens)
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
      }
    }

    fetchData()
  }, [])

  const navMainWithItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: DashboardIcon,
      isActive: true,
    },
    {
      title: "Components",
      url: "#",
      icon: Component1Icon,
      items: components.map(component => ({
        title: component.name,
        url: `/component/${component._id}`,
        onClick: () => navigate(`/component/${component._id}`)
      }))
    },
    {
      title: "Design Tokens",
      url: "#",
      icon: TokensIcon,
      items: [
        { 
          title: "Colors", 
          url: "/colors",
          onClick: () => navigate('/colors')
        },
        { 
          title: "Typography", 
          url: "/typography",
          onClick: () => navigate('/typography')
        },
        { 
          title: "Spacing", 
          url: "/spacing",
          onClick: () => navigate('/spacing')
        },
        { 
          title: "Border Radius", 
          url: "/border-radius",
          onClick: () => navigate('/border-radius')
        },
        { 
          title: "Blur", 
          url: "/blur",
          onClick: () => navigate('/blur')
        }
      ]
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: FileTextIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: GearIcon,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={baseData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Theme Toggle */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      <MoonIcon className="h-4 w-4" />
                      <span className="text-sm">Theme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      />
                      <SunIcon className="h-4 w-4" />
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Search Bar */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-8 text-sm"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-3 w-3 border border-gray-300 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border rounded-md shadow-lg">
                    {searchResults.map((token) => (
                      <div
                        key={token._id}
                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b last:border-b-0"
                        onClick={() => {
                          navigate(`/${token.category}`)
                          setSearchQuery('')
                          setSearchResults([])
                        }}
                      >
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{token.category} • {token.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <NavMain items={navMainWithItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={baseData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
