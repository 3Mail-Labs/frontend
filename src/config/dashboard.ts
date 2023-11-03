import { NavItem, SidebarNavItem } from "@/types";

export type DashboardConfig = {
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Campaigns",
      href: "/dashboard",
      icon: "add",
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      icon: "check",
    },
    {
      title: "Lists",
      href: "/dashboard/lists",
      icon: "ellipsis",
    },
  ],
};
