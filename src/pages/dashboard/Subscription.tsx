import { useState } from "react";
import { Check, Crown, Zap, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuotaProgress } from "@/components/ui/quota-progress";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockSubscription, subscriptionPlans } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const planIcons: Record<string, React.ReactNode> = {
  free: <Zap className="h-6 w-6" />,
  standard: <Crown className="h-6 w-6" />,
  pro: <Building2 className="h-6 w-6" />,
  lawyer: <Briefcase className="h-6 w-6" />,
};

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeDialog(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Abonnement</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre plan et suivez votre consommation
        </p>
      </div>

      {/* Current subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Votre abonnement actuel</CardTitle>
              <CardDescription className="mt-1">
                Plan {mockSubscription.plan.charAt(0).toUpperCase() + mockSubscription.plan.slice(1)}
              </CardDescription>
            </div>
            <StatusBadge status={mockSubscription.status} type="subscription" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <QuotaProgress
              label="Dossiers ce mois"
              used={mockSubscription.usage.cases}
              limit={mockSubscription.limits.cases}
            />
            <QuotaProgress
              label="Documents uploadés"
              used={mockSubscription.usage.documents}
              limit={mockSubscription.limits.documents}
            />
          </div>

          {mockSubscription.renewDate && (
            <p className="text-sm text-muted-foreground">
              Prochain renouvellement : {new Date(mockSubscription.renewDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Changer de plan</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = plan.id === mockSubscription.plan;
            
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative transition-shadow hover:shadow-lg",
                  plan.popular && "ring-2 ring-primary",
                  isCurrentPlan && "bg-accent/50"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Le plus populaire
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isCurrentPlan ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {planIcons[plan.id]}
                    </div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}€</span>
                    {plan.price > 0 && <span className="text-muted-foreground">/mois</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Plan actuel
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {subscriptionPlans.findIndex(p => p.id === mockSubscription.plan) < 
                       subscriptionPlans.findIndex(p => p.id === plan.id)
                        ? "Passer au plan " + plan.name
                        : "Rétrograder"
                      }
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Changer de plan</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de passer au plan{" "}
              {subscriptionPlans.find(p => p.id === selectedPlan)?.name}. 
              Le changement prendra effet immédiatement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction>Confirmer le changement</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
