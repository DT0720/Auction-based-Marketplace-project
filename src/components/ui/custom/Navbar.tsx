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
import SearchBar from "./SearchBar";
import { useCart } from "@/hooks/use-cart";
import { NotificationDropdown } from "./Notificationdropdown";


const Navbar = () => {
  const { user, isAuthenticated, logout, currentBalance } = useAuth(); // Hook for authentication state
  const router = useRouter(); // Next.js router
  const pathname = usePathname(); // To determine the active page
  const { cartCount } = useCart(); // Hook for cart state

  const isBuyer = user?.type.toLocaleLowerCase() === "b"; 
  const isSeller = user?.type.toLocaleLowerCase() === "s";

  const formattedCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(currentBalance);

  const logoutHandler = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Home className="mr-2 text-blue-500" />
          <span className="font-bold text-lg">MyApp</span>
        </div>

        {/* Center: Search Bar for Logged-in Users */}
        {isAuthenticated && (
          <div className="flex-grow flex justify-center">
            <SearchBar /> {/* Render the custom SearchBar component */}
          </div>
        )}

        {/* Right: Conditional buttons */}
        <div className="flex items-center gap-4">
          <NotificationDropdown />
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
              <Button variant="ghost" className="mr-4" onClick={() => router.push(ROUTES.SHOPPING_CART)}>
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="mb-1 bg-red-500 text-white rounded-full px-1 text-xs">{cartCount}</span>
                )}
              </Button>
              <Button variant="ghost" className="mr-4">
                <CreditCard />
                <span className="ml-2">{formattedCurrency}</span>
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
              {/* Seller View */}
              <Button variant="ghost" className="mr-4" onClick={() => console.log("Notifications")}>
                <Bell />
              </Button>
              <Button variant="ghost" className="mr-4">
                <CreditCard />
                <span className="ml-2">{formattedCurrency}</span>
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
                  <DropdownMenuItem onClick={() => console.log("Navigate to Ongoing Bids")}>
                  <List className="mr-2 h-4 w-4" />
                  Your Auctions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

