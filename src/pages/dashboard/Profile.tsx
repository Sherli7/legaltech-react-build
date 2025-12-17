import { useState } from "react";
import { User, Mail, Building2, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockUser } from "@/lib/mock-data";

const roleLabels = {
  individual: "Particulier",
  company: "Entreprise",
  lawyer: "Avocat",
};

export default function Profile() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées.",
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Ces informations seront utilisées pour vos dossiers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
            />
          </div>

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Type de compte</p>
                <p className="text-sm text-muted-foreground">Votre profil utilisateur</p>
              </div>
            </div>
            <Badge variant="secondary">{roleLabels[mockUser.role]}</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email vérifié</p>
                <p className="text-sm text-muted-foreground">Statut de vérification</p>
              </div>
            </div>
            <Badge variant={mockUser.isVerified ? "default" : "destructive"}>
              {mockUser.isVerified ? "Vérifié" : "Non vérifié"}
            </Badge>
          </div>

          <Separator />

          <div className="pt-4">
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Supprimer mon compte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
