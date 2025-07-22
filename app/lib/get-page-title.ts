import { menuItems } from "~/constants/sidebar-menu";

export const getPageTitle = (pathname: string): string => {
  for (const item of menuItems) {
    if (item.url === pathname) {
      return item.title;
    }

    if ("children" in item && Array.isArray(item.children)) {
      for (const child of item.children) {
        if (child.url === pathname) {
          return child.title;
        }
      }
    }
  }

  return "Dashboard";
};
