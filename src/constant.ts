export const BE_URL = "http://localhost:3001";
import { Home, BarChart, Bell, Layers } from "lucide-react";

export const menuItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Layers,
    label: "Gedung",
    path: "/dashboard/gedung",
    adminOnly: true, // Added explicit admin flag
  },
  {
    icon: BarChart,
    label: "Jadwal",
    path: "/dashboard/jadwal",
    adminOnly: true, // Added explicit admin flag
  },
  {
    icon: Bell,
    label: "Notifications",
    path: "/dashboard/notifications",
  },
];

export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.99,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.01,
  },
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};
