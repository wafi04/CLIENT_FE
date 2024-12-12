import App from "@/App";
import { LoginPage } from "@/auth/components/LoginPage";
import { RegisterPage } from "@/auth/components/RegisterPage";
import { Dashboard } from "@/components/styling/dashboard/Dashboard";
import { DashboardGedung } from "@/components/styling/dashboard/DashboardGedung";
import { DashboardHome } from "@/components/styling/dashboard/DashboardHome";
import { DashboardJadwal } from "@/components/styling/dashboard/DashboardJadwal";
import { GedungAvailable } from "@/features/admin/gedung/components/GedungAvailable";
import { GedungByIdPage } from "@/features/admin/gedung/components/GedungById";
import { BookingUser } from "@/features/user/booking/components/BookingUser";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/gedung/:id",
    element: <GedungByIdPage />,
  },
  {
    path: "/bookings",
    element: <BookingUser />,
  },
  {
    path: "/venues",
    element: <GedungAvailable />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "gedung",
        element: <DashboardGedung />,
      },
      {
        path: "jadwal",
        element: <DashboardJadwal />,
      },
    ],
  },
]);
