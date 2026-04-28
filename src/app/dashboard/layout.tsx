import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppNavbar } from "@/components/layout/app-navbar"
import { AppContent } from "@/components/layout/app-content"
import { getSession, verifySession } from "@/lib/session"
import { AuthSessionHydrator } from "@/features/auth/components/AuthSessionHydrator"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  await verifySession()

  return (
    <SidebarProvider className="bg-sidebar">
      <AuthSessionHydrator
        user={
          session?.userId
            ? {
                id: session.userId,
                email: session.email,
                roleCode: session.roleCode ?? null,
              }
            : null
        }
      />
      <AppSidebar />
      <SidebarInset className="my-2 mr-2 gap-2">
        <AppNavbar />
        <AppContent>{children}</AppContent>
      </SidebarInset>
    </SidebarProvider>
  )
}
