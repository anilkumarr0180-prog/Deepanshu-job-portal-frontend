export interface NavMenuItem {
  label: string;
  path: string;
  hasDropdown?: boolean;
}

export const NAV_MENU: NavMenuItem[] = [
  {
    label: "Home",
    path: "/",
    hasDropdown: true,
  },
  {
    label: "Find a Job",
    path: "/jobs",
    hasDropdown: true,
  },
  {
    label: "Recruiters",
    path: "/recruiters",
    hasDropdown: true,
  },
  {
    label: "Candidates",
    path: "/candidates",
    hasDropdown: true,
  },
  {
    label: "Pages",
    path: "/pricing",
    hasDropdown: true,
  },
  {
    label: "Blog",
    path: "/blog",
    hasDropdown: true,
  },
  {
    label: "Contact",
    path: "/contact",
    hasDropdown: false,
  },
];