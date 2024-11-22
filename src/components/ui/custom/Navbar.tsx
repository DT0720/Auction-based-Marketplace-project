"use client"

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn button
import { Bell, ShoppingCart, CreditCard, Settings, Menu, User, Home, List, LogOut } from "lucide-react"; // lucide icons
import useAuth from "@/hooks/use-auth";
import { ROUTES } from "@/application/routing/routes";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";


const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Hook for authentication state
  const router = useRouter(); // Next.js router
  const pathname = usePathname(); // To determine the active page

  const isBuyer = user?.type.toLocaleLowerCase() === "b"; 
  const isSeller = user?.type.toLocaleLowerCase() === "s";

  const logoutHandler = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center justify-between px-4 py-2 z-10">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Home className="mr-2 text-blue-500" />
        <span className="font-bold text-lg">MyApp</span>
      </div>

      {/* Right: Conditional buttons */}
      <div className="flex items-center">
        {!isAuthenticated ? (
          <>
            {/* Guest View: Login & Signup */}
            <Button
              variant={pathname === ROUTES.LOGIN ? "default" : "ghost"}
              className="mr-4"
              onClick={() => router.push(ROUTES.LOGIN)}
            >
              Login
            </Button>
            <Button
              variant={pathname === ROUTES.SIGNUP ? "default" : "ghost"}
              onClick={() => router.push(ROUTES.SIGNUP)}
            >
              Sign Up
            </Button>
          </>
        ) : isBuyer ? (
          <>
            {/* Buyer View */}
            <Button variant="ghost" className="mr-4" onClick={() => console.log("Notifications")}>
              <Bell />
            </Button>
            <Button variant="ghost" className="mr-4" onClick={() => console.log("View Cart")}>
              <ShoppingCart />
            </Button>
            <Button variant="ghost" className="mr-4">
              <CreditCard />
              <span className="ml-2">$XX.XX</span>
            </Button>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-bold">
                  {user?.name || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log("Navigate to My Profile")}>
                <User className="mr-2 h-4 w-4" />
                My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Navigate to Billing")}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Navigate to Settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log("Navigate to My Cart")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                My Cart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Navigate to Ongoing Bids")}>
                <List className="mr-2 h-4 w-4" />
                Ongoing Bids
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : isSeller ? (
          <>
            {/* Placeholder for Seller View */}
            {/* Add Seller-specific items here later */}
            <span className="text-gray-500">Seller options coming soon...</span>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
