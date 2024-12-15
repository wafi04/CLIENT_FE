import { Link } from "react-router-dom";
import { Building2, Calendar, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useLogout } from "@/auth/api/UseAuth";
import { useAuth } from "@/lib/AuthProvider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mutate, isPending } = useLogout();
  const { isAdmin } = useAuth();
  return (
    <nav className="sticky top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="size-8 text-blue-600" />
            <span className="text-3xl font-bebas text-gray-800">BOOKINGS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/venues"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Building2 className="h-5 w-5" />
              <span>Venues</span>
            </Link>
            <Link
              to="/bookings"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Calendar className="h-5 w-5" />
              <span>My Bookings</span>
            </Link>
            {isAdmin && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                <Calendar className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            )}

            <Button
              onClick={() => mutate()}
              disabled={isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden px-2 pt-2 pb-4 space-y-5">
            <Link
              to="/venues"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Building2 className="h-5 w-5" />
              <span>Venues</span>
            </Link>
            <Link
              to="/bookings"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Calendar className="h-5 w-5" />
              <span>My Bookings</span>
            </Link>
            <Button
              onClick={() => mutate()}
              disabled={isPending}
              className="bg-blue-600 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Logout
            </Button>
          </nav>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
