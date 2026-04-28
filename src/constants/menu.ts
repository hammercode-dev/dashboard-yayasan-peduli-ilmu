import { BookOpen, Clock, Home, ScrollText, Users } from "lucide-react"

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
  {
    title: "Timeline",
    url: "/dashboard/timeline",
    icon: Clock,
  },
  {
    title: "Users",
    url: "/dashboard/user",
    icon: Users,
  },
]
