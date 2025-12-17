import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Eye, EyeOff, ArrowRight, Building2, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const roles = [
  { 
    id: "individual" as UserRole, 
    label: "Particulier", 
    icon: User,
    description: "Je suis un particulier avec un litige" 
  },
  { 
    id: "company" as UserRole, 
    label: "Entreprise", 
    icon: Building2,
    description: "Je représente une entreprise" 
  },
  { 
    id: "lawyer" as UserRole, 
    label: "Avocat", 
    icon: Briefcase,
    description: "Je suis professionnel du droit" 
  },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Compte créé",
        description: "Vérifiez votre email pour activer votre compte",
      });
      navigate("/auth/verify");
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
            Rejoignez la plateforme de résolution amiable
          </h1>
          <ul className="space-y-4 text-primary-foreground/80">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              Analyse juridique par IA
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              Proposition d'ententes équilibrées
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              Signature électronique sécurisée
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              Confidentialité garantie
            </li>
          </ul>
        </div>
      </div>

      {/* Right panel - Register form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <img src="/solvilo-removebg.png" alt="SOLVILO" className="h-12 w-auto" />
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
              <CardDescription>
                {step === 1 ? "Choisissez votre profil" : "Complétez vos informations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                <div className="space-y-4">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRole(r.id);
                        setStep(2);
                      }}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 text-left transition-all",
                        "hover:border-primary hover:bg-accent",
                        role === r.id ? "border-primary bg-accent" : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <r.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{r.label}</div>
                          <div className="text-sm text-muted-foreground">{r.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-11"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1 h-11"
                    >
                      Retour
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-11"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          Créer mon compte
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Déjà un compte ?</span>{" "}
                <Link to="/auth/login" className="text-primary font-medium hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
