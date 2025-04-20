import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Smartphone,
  Github,
  FileText,
  Code,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const { currentUser, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handle authentication
  useEffect(() => {
    if (!currentUser) {
      setLocation("/admin/login");
    }
  }, [currentUser, setLocation]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/admin/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Apps",
      path: "/admin/apps",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      name: "GitHub Repos",
      path: "/admin/github-repos",
      icon: <Github className="h-5 w-5" />,
    },
    {
      name: "Blog Posts",
      path: "/admin/blog-posts",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Code Samples",
      path: "/admin/code-samples",
      icon: <Code className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  // If no user is authenticated, don't render anything
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white dark:bg-gray-800"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  setLocation(item.path);
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-start px-3">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={currentUser.photoURL || undefined}
                      alt={currentUser.displayName || "User"}
                    />
                    <AvatarFallback>
                      {currentUser.displayName
                        ? currentUser.displayName.charAt(0).toUpperCase()
                        : currentUser.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">
                      {currentUser.displayName || currentUser.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setLocation("/admin/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className={cn(
        "flex-1 overflow-auto",
        isSidebarOpen ? "lg:ml-64" : ""
      )}>
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}