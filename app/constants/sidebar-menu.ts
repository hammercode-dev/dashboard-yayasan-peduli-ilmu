import { Heart, Home } from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    title: "Donasi",
    icon: Heart,
    url: "/donation",
  },
  // {
  //   title: "Donatur",
  //   icon: Users,
  //   url: "/donors",
  //   children: [
  //     {
  //       title: "Daftar Donatur",
  //       url: "/donors/list",
  //     },
  //     {
  //       title: "Donatur Aktif",
  //       url: "/donors/active",
  //     },
  //     {
  //       title: "Donatur Baru",
  //       url: "/donors/new",
  //     },
  //   ],
  // },
];
