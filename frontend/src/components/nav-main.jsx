import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function NavMain({
  items
}) {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title}
                  isActive={location.pathname === item.url}
                  asChild={!item.items}
                >
                  {item.items ? (
                    <div className="flex w-full items-center gap-1">
                      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                      <span className="flex-1 truncate">{item.title}</span>
                      <ChevronRightIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </div>
                  ) : (
                    <Link to={item.url} className="flex w-full items-center gap-1">
                      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                      <span className="flex-1 truncate">{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                          onClick={subItem.onClick}
                        >
                          <span className="truncate">{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
