import { Link } from "react-router-dom";
import { Scale, ArrowRight, Shield, Clock, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Analyse IA",
    description: "Notre IA juridique hybride analyse votre dossier en quelques heures",
  },
  {
    icon: Clock,
    title: "Résolution rapide",
    description: "Délai moyen de 15 jours contre plusieurs mois en contentieux",
  },
  {
    icon: Shield,
    title: "Confidentialité",
    description: "Vos données sont protégées et le processus reste confidentiel",
  },
];

const steps = [
  { number: "01", title: "Soumettez", description: "Décrivez votre litige et uploadez vos documents" },
  { number: "02", title: "Analysez", description: "Notre IA étudie votre dossier et pose des questions" },
  { number: "03", title: "Négociez", description: "Recevez une proposition d'entente équilibrée" },
  { number: "04", title: "Signez", description: "Finalisez l'accord avec signature électronique" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <nav className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SOLVILO</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/register">
                Commencer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in">
            Résolution amiable de vos{" "}
            <span className="text-primary">litiges contractuels</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
            SOLVILO est une plateforme innovante propulsée par l'intelligence artificielle 
            pour résoudre vos différends de manière rapide, efficace et économique.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Button size="lg" asChild>
              <Link to="/auth/register">
                Démarrer gratuitement
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/login">J'ai déjà un compte</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary">15j</div>
              <div className="text-sm text-muted-foreground mt-1">Délai moyen</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary">92%</div>
              <div className="text-sm text-muted-foreground mt-1">Taux de succès</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary">-70%</div>
              <div className="text-sm text-muted-foreground mt-1">vs contentieux</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Pourquoi choisir SOLVILO ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Une approche moderne de la résolution des litiges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Un processus simple en 4 étapes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="solvilo-gradient rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-solvilo-navy/95" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Prêt à résoudre votre litige ?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Créez votre compte gratuitement et soumettez votre premier dossier en quelques minutes.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth/register">
                  Commencer maintenant
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">SOLVILO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SOLVILO. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
