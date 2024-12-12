import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthProvider";
import { LoadingOverlay } from "../ui/LoadingOverlay";
import { pageTransition, pageVariants } from "@/constant";
import Navbar from "./Navbar";

type LayoutType = "public" | "auth" | "protected" | "admin";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

interface LayoutProps extends BaseLayoutProps {
  layoutType: LayoutType;
}

const getRedirectPath = (
  isAuthenticated: boolean,
  hasProfile: boolean,
  layoutType: LayoutType,
  currentPath: string,
  isAdmin: boolean
): string | null => {
  if (layoutType === "protected" && !isAuthenticated) {
    return "/login";
  }

  // Redirect non-admin dari halaman admin
  if (layoutType === "admin" && !isAdmin) {
    return "/login";
  }

  // If it's an auth route (like login page) and user is authenticated with a profile, redirect to dashboard
  if (layoutType === "auth" && isAuthenticated && hasProfile) {
    return "/";
  }

  return null;
};
export function MainLayout({
  children,
  className = "",
  title = "Aplikasi",
  layoutType,
}: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth();
  const hasProfile = Boolean(user);

  // Update page title
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) {
      return;
    }

    const redirectPath = getRedirectPath(
      isAuthenticated,
      hasProfile,
      layoutType,
      location.pathname,
      isAdmin
    );

    // Only redirect if we have a path and it's different from current
    if (redirectPath && redirectPath !== location.pathname) {
      navigate(redirectPath, {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [
    isAuthenticated,
    isLoading,
    hasProfile,
    navigate,
    layoutType,
    location.pathname,
  ]);
  useEffect(() => {
    console.log("Layout Context:", {
      isAuthenticated,
      isLoading,
      hasProfile,
      currentPath: location.pathname,
      layoutType,
    });
  }, [isAuthenticated, isLoading, hasProfile, location.pathname, layoutType]);

  // Show loading overlay while checking auth status for protected routes
  if (layoutType === "protected" && isLoading) {
    return <LoadingOverlay />;
  }

  // Don't render protected content until loading is complete and auth is verified
  if (
    layoutType === "protected" &&
    !isLoading &&
    (!isAuthenticated || !hasProfile)
  ) {
    return null;
  }

  // Don't render auth pages if already authenticated
  if (layoutType === "auth" && !isLoading && isAuthenticated && hasProfile) {
    return null;
  }

  const showNavbar = layoutType !== "auth";

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}>
      {showNavbar && <Navbar />}
      {children}
    </motion.div>
  );
}

export function AdminLayout({ children, ...props }: BaseLayoutProps) {
  return (
    <MainLayout layoutType="admin" {...props}>
      {children}
    </MainLayout>
  );
}

export function ProtectedLayout({ children, ...props }: BaseLayoutProps) {
  return (
    <MainLayout layoutType="protected" {...props}>
      {children}
    </MainLayout>
  );
}

export function AuthLayout({ children, ...props }: BaseLayoutProps) {
  return (
    <MainLayout layoutType="auth" {...props}>
      {children}
    </MainLayout>
  );
}

export function PublicLayout({ children, ...props }: BaseLayoutProps) {
  return (
    <MainLayout layoutType="public" {...props}>
      {children}
    </MainLayout>
  );
}
