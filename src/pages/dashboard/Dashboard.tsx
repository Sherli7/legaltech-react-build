import { Link } from "react-router-dom";
import { Plus, FolderOpen, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuotaProgress } from "@/components/ui/quota-progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockCases, mockSubscription } from "@/lib/mock-data";

export default function Dashboard() {
  const recentCases = mockCases.slice(0, 3);
  const quotaReached = mockSubscription.usage.cases >= mockSubscription.limits.cases;

  const stats = [
    { 
      label: "Dossiers actifs", 
      value: mockCases.filter(c => !["signed", "closed"].includes(c.status)).length,
      icon: FolderOpen,
      color: "text-primary"
    },
    { 
      label: "En attente", 
      value: mockCases.filter(c => c.status === "clarification").length,
      icon: Clock,
      color: "text-warning"
    },
    { 
      label: "Résolus", 
      value: mockCases.filter(c => c.status === "signed").length,
      icon: CheckCircle2,
      color: "text-success"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos dossiers et suivez leur avancement
          </p>
        </div>
        <Button asChild disabled={quotaReached}>
          <Link to="/dashboard/cases/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Link>
        </Button>
      </div>

      {/* Quota alert */}
      {quotaReached && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vous avez atteint votre quota de dossiers.{" "}
            <Link to="/dashboard/subscription" className="font-medium underline">
              Passez à un plan supérieur
            </Link>{" "}
            pour continuer.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent cases */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dossiers récents</CardTitle>
              <CardDescription>Vos derniers dossiers en cours</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/cases">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun dossier pour le moment</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link to="/dashboard/cases/new">Créer mon premier dossier</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCases.map((caseFile) => (
                  <Link
                    key={caseFile.id}
                    to={`/dashboard/cases/${caseFile.id}`}
                    className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            {caseFile.reference}
                          </span>
                          <StatusBadge status={caseFile.status} type="case" />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {caseFile.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          vs {caseFile.opposingParty}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{caseFile.currentStep}</p>
                        <p className="mt-1">
                          {new Date(caseFile.updatedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription card */}
        <Card>
          <CardHeader>
            <CardTitle>Mon abonnement</CardTitle>
            <CardDescription>
              Plan {mockSubscription.plan.charAt(0).toUpperCase() + mockSubscription.plan.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StatusBadge status={mockSubscription.status} type="subscription" />
            
            <div className="space-y-4">
              <QuotaProgress
                label="Dossiers"
                used={mockSubscription.usage.cases}
                limit={mockSubscription.limits.cases}
              />
              <QuotaProgress
                label="Documents"
                used={mockSubscription.usage.documents}
                limit={mockSubscription.limits.documents}
              />
            </div>

            {mockSubscription.renewDate && (
              <p className="text-xs text-muted-foreground">
                Prochain renouvellement : {new Date(mockSubscription.renewDate).toLocaleDateString("fr-FR")}
              </p>
            )}

            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/subscription">
                Gérer mon abonnement
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
