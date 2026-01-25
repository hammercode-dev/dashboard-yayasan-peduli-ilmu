'use client'

import { usePathname } from 'next/navigation'

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { MAIN_MENU_ITEMS } from '@/constants/menu'
import { cn } from '@/lib/utils'

function getPageTitle(pathname: string): string {
  const menuItem = MAIN_MENU_ITEMS.find((item) => item.url === pathname)
  if (menuItem) return menuItem.title

  if (pathname.startsWith('/dashboard/program')) return 'Program'
  if (pathname.startsWith('/dashboard/users')) return 'Pengguna'
  if (pathname.startsWith('/dashboard/settings')) return 'Pengaturan'

  return 'Dashboard'
}

export const AppNavbar = () => {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  const { state } = useSidebar()

  return (
    <div
      className={cn(
        'rounded-xl bg-background border shadow-sm',
        state === 'collapsed' ? 'ml-0' : 'md:ml-0 ml-2',
      )}
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-medium">{pageTitle}</h1>
        </div>
      </header>
    </div>
  )
}
