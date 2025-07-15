import { Wrench, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Wrench className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">FieldService Pro</h1>
          </div>
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
