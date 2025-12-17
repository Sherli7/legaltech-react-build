import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Number with animation */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 md:w-24 md:h-24 text-primary/40 animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page introuvable
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <p className="text-sm text-muted-foreground/60 font-mono">
            {location.pathname}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="gap-2 min-w-[180px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="gap-2 min-w-[180px]"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Besoin d'aide ?{" "}
            <a
              href="mailto:support@solvilo.com"
              className="text-primary hover:underline"
            >
              Contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
