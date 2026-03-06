import { BookOpen, Home, ScrollText } from "lucide-react"

export const MAIN_MENU_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Program",
    url: "/dashboard/program",
    icon: BookOpen,
  },
  {
    title: "Donasi",
    url: "/dashboard/donation",
    icon: ScrollText,
  },
]
