import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppNavbar } from "@/components/layout/app-navbar"
import { AppContent } from "@/components/layout/app-content"
import { verifySession } from "@/lib/session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await verifySession()

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
