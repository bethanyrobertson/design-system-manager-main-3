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
import { componentsAPI, tokensAPI } from '@/lib/api'

// Design System Manager data
const baseData = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Design System",
      logo: ColorWheelIcon,
      plan: "Manager",
    },
  ],
  projects: [],
}

export function AppSidebar({
  theme,
  setTheme,
  ...props
}) {
  const navigate = useNavigate()
  const [components, setComponents] = React.useState([])
  const [tokens, setTokens] = React.useState([])

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
        
        <NavMain items={navMainWithItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={baseData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
