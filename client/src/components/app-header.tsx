import { Wrench, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export function AppHeader() {
  const [location] = useLocation();

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Wrench className="h-6 w-6 text-primary" />
            <Link href="/">
              <h1 className="text-xl font-semibold text-foreground hover:text-primary cursor-pointer">
                FieldService Pro
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                className="px-4"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/customers">
              <Button 
                variant={location === "/customers" ? "default" : "ghost"} 
                size="sm"
                className="px-4"
              >
                Customers
              </Button>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-sm text-muted-foreground">Welcome back, </span>
              <span className="text-sm font-medium text-foreground">John Smith</span>
            </div>
            <Button variant="ghost" size="sm" className="p-2 rounded-full">
              <UserCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
