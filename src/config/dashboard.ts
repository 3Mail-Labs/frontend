import { NavItem, SidebarNavItem } from "@/types";

export type DashboardConfig = {
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "Campaigns",
      href: "/dashboard",
      icon: "mail",
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      icon: "user",
    },
    {
      title: "Lists",
      href: "/dashboard/lists",
      icon: "list",
    },
    {
      title: "Embed",
      href: "/dashboard/embed",
      icon: "code",
    },
  ],
};
