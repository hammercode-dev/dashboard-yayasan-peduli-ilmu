import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Heart, LogOut, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { menuItems } from "~/constants/sidebar-menu";

interface MenuItemType {
  title: string;
  icon: any;
  url: string;
  children?: { title: string; url: string }[];
}

function MenuItemComponent({ item }: { item: MenuItemType }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link to={item.url} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </div>
        <ChevronUp
          className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-90"}`}
        />
      </SidebarMenuButton>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <SidebarMenu className="ml-6 mt-1">
          {item.children.map((child, index) => (
            <SidebarMenuItem
              key={child.title}
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              <SidebarMenuButton asChild size="sm">
                <Link to={child.url}>
                  <span>{child.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </SidebarMenuItem>
  );
}

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-3 focus-ring rounded-lg p-2">
          <img src="/logo.png" alt="Yayasan Peduli Ilmu" className="h-8 w-auto" />
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-accent-800">Yayasan Peduli Ilmu</h2>
            <p className="text-xs text-gray-600">Sulawesi Tengah</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <MenuItemComponent key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div>
                <LogOut />
                <span>Keluar</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
