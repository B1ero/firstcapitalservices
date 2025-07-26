import { useState } from "react";
import { Button } from "./ui/button";
import {
  Heart,
  LogOut,
  User,
  Home,
  Search,
  Settings,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import CreateAccountModal from "./CreateAccountModal";
import SignInModal from "./SignInModal";
import { useAuthStore } from "@/lib/store/auth";

interface NavItem {
  title: string;
  items: Array<{
    label: string;
    to?: string;
  }>;
}

const navigationItems: NavItem[] = [
  {
    title: "Buy",
    items: [
      { label: "All Listings", to: "/listings" },
      { label: "Featured Listings", to: "/featured-listings" },
    ],
  },
  {
    title: "Sell",
    items: [
      { label: "Sell My Home", to: "/sell" },
      { label: "Home Valuation", to: "/home-valuation" },
    ],
  },
  {
    title: "Rent",
    items: [{ label: "Apartments for Rent" }, { label: "Houses for Rent" }],
  },
  {
    title: "Neighborhoods",
    items: [
      { label: "Claremont" },
      { label: "Upland" },
      { label: "La Verne" },
      { label: "Glendora" },
      { label: "San Dimas" },
      { label: "Rancho Cucamonga" },
      { label: "Fontana" },
    ],
  },
];

const Header = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
          <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between gap-1 xs:gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2 h-10 w-10"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo Section */}
            <Link to="/" className="shrink-0">
              <span className="text-sm xs:text-base sm:text-lg md:text-xl font-light tracking-wider text-secondary hover:text-primary transition-colors whitespace-nowrap">
                FIRST CAPITAL <span className="font-medium">SERVICES</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center">
                {navigationItems.map((nav) => (
                  <div key={nav.title} className="relative group">
                    <button className="h-20 px-4 text-sm font-medium bg-transparent hover:bg-transparent hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transform after:scale-x-0 after:transition-transform hover:after:scale-x-100 group-hover:after:scale-x-100 transition-colors duration-200">
                      {nav.title}
                    </button>
                    <div className="absolute left-0 top-full z-10 min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <ul className="p-2 bg-white rounded-md shadow-lg border border-border/50 mt-0">
                        {nav.items.map((item) => (
                          <li key={item.label}>
                            {item.to ? (
                              <Link
                                to={item.to}
                                className="block select-none rounded-sm px-3 py-2.5 text-sm leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-primary"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <a
                                href="#"
                                className="block select-none rounded-sm px-3 py-2.5 text-sm leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-primary"
                              >
                                {item.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            {/* Actions Section */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 md:h-10 md:w-10 p-0 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                    >
                      <Avatar className="h-7 w-7 md:h-8 md:w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm md:text-base">
                          {useAuthStore.getState().profile?.first_name?.[0] ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/my-homes" className="cursor-pointer">
                        <Home className="mr-2 h-4 w-4" />
                        <span>My Homes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favorites" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>My Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-searches" className="cursor-pointer">
                        <Search className="mr-2 h-4 w-4" />
                        <span>My Searches</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account-settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={async () => {
                        const btn = document.activeElement as HTMLElement;
                        if (btn) btn.blur();
                        await new Promise((resolve) =>
                          setTimeout(resolve, 150),
                        );
                        signOut();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 sm:h-9 px-1.5 xs:px-2 sm:px-3 md:h-10 md:px-4 hover:bg-primary/5 hover:text-primary transition-all duration-200 text-xs xs:text-sm whitespace-nowrap"
                    onClick={() => setShowSignIn(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 px-2 xs:px-3 sm:px-4 md:h-10 md:px-6 bg-primary hover:bg-primary-hover text-white transition-all duration-200 text-xs xs:text-sm whitespace-nowrap"
                    onClick={() => setShowCreateAccount(true)}
                  >
                    <span className="hidden xs:inline">Get Started</span>
                    <span className="xs:hidden">Start</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-left text-lg font-light tracking-wider">
              FIRST CAPITAL <span className="font-medium">SERVICES</span>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {navigationItems.map((nav) => (
              <div key={nav.title} className="px-6 py-2">
                <h3 className="text-sm font-semibold mb-2">{nav.title}</h3>
                <ul className="space-y-1">
                  {nav.items.map((item) => (
                    <li key={item.label}>
                      {item.to ? (
                        <Link
                          to={item.to}
                          className="block py-2 px-3 text-sm rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href="#"
                          className="block py-2 px-3 text-sm rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Add spacing for fixed header */}
      <div className="h-14 sm:h-16 md:h-20" />

      <CreateAccountModal
        open={showCreateAccount}
        onOpenChange={setShowCreateAccount}
        onSignIn={() => {
          setShowCreateAccount(false);
          setShowSignIn(true);
        }}
      />
      <SignInModal
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onCreateAccount={() => {
          setShowSignIn(false);
          setShowCreateAccount(true);
        }}
      />
    </>
  );
};

export default Header;
