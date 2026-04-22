import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CoffeeLogo } from "@/components/coffee-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    // fake auth
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-6 flex justify-center">
            <CoffeeLogo size={26} />
          </div>
          <Card className="rounded-2xl border-border bg-card p-8 shadow-lg">
            <h1 className="mb-1 text-center text-xl font-semibold text-foreground">Welcome back</h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Sign in to your Watcher dashboard
            </p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full" onClick={handleSignIn}>
                Sign In
              </Button>
              <div className="text-center">
                <button className="text-xs text-muted-foreground hover:text-primary">
                  Forgot password?
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
