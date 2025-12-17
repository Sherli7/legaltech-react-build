import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur SOLVILO",
      });
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 solvilo-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-solvilo-navy/95" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <img src="/solvilo-removebg.png" alt="SOLVILO" className="h-16 w-auto" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Résolution amiable de vos litiges contractuels
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Une plateforme innovante propulsée par l'IA juridique pour résoudre vos différends 
            de manière rapide, efficace et économique.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">15j</div>
              <div className="text-sm text-primary-foreground/70">Délai moyen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">92%</div>
              <div className="text-sm text-primary-foreground/70">Taux de résolution</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">-70%</div>
              <div className="text-sm text-primary-foreground/70">vs contentieux</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <img src="/solvilo-removebg.png" alt="SOLVILO" className="h-12 w-auto" />
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>
                Accédez à votre espace personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@email.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link 
                      to="/auth/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Se connecter
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Pas encore de compte ?</span>{" "}
                <Link to="/auth/register" className="text-primary font-medium hover:underline">
                  Créer un compte
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
