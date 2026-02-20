"use client"

import * as React from "react"
import {
  IconBuildingWarehouse,
  IconDashboard,
  IconFolders,
  IconInnerShadowTop,
  IconPackage,
} from "@tabler/icons-react"

import { NavMain } from "@/components/dashboard/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"



const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Categorías",
      url: "/dashboard/categorias",
      icon: IconFolders ,
    },
    {
      title: "Productos",
      url: "/dashboard/productos",
      icon: IconPackage,
    },
    {
      title: "Inventario",
      url: "/dashboard/inventario",
      icon: IconBuildingWarehouse,
    }
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Hyugodev-Inventario</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
       
      </SidebarFooter>
    </Sidebar>
  )
}
