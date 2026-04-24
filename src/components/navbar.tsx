import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CoffeeLogo } from "./coffee-logo";
import { ThemeToggle } from "./theme-toggle";
import { LogOut } from "lucide-react";
import { clearAuth, getAuthUser } from "@/lib/auth";
import { clearCachedSites } from "@/lib/sites-cache";

export function Navbar() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const user = getAuthUser();

  const handleLogout = () => {
    clearCachedSites();
    clearAuth();
    qc.clear();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <CoffeeLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Avatar className="h-8 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {"Admin"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-foreground hover:text-destructive"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
