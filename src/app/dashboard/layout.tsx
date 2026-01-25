import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppNavbar } from '@/components/layout/app-navbar'
import { AppContent } from '@/components/layout/app-content'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="bg-sidebar">
      <AppSidebar />
      <SidebarInset className="my-2 mr-2 gap-2">
        <AppNavbar />
        <AppContent>{children}</AppContent>
      </SidebarInset>
    </SidebarProvider>
  )
}
