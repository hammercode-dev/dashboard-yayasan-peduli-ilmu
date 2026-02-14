'use client'
import { cn } from '@/lib/utils'
import { useSidebar } from '../ui/sidebar'

export const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar()
  return (
    <main
      className={cn(
        'flex-1 overflow-auto rounded-xl border bg-background sm:px-6 px-4 py-6 shadow-sm',
        state === 'collapsed' ? 'ml-0' : 'md:ml-0 ml-2',
      )}
    >
      {children}
    </main>
  )
}
