import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, X, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { WizardStepper, type WizardStep } from "@/components/wizard/WizardStepper";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { CaseRole } from "@/types";

const steps: WizardStep[] = [
  { id: 1, title: "Rôle", description: "Votre position" },
  { id: 2, title: "Exposé", description: "Les faits" },
  { id: 3, title: "Contrats", description: "Documents" },
  { id: 4, title: "Pièces", description: "Justificatifs" },
  { id: 5, title: "Validation", description: "Signature" },
];

export default function NewCase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [role, setRole] = useState<CaseRole | null>(null);
  const [narrative, setNarrative] = useState("");
  const [contracts, setContracts] = useState<File[]>([]);
  const [evidence, setEvidence] = useState<File[]>([]);
  const [accepted, setAccepted] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return role !== null;
      case 2: return narrative.length >= 100;
      case 3: return contracts.length >= 1;
      case 4: return true; // Evidence is optional
      case 5: return accepted;
      default: return false;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "contracts" | "evidence") => {
    const files = Array.from(e.target.files || []);
    if (type === "contracts") {
      setContracts(prev => [...prev, ...files].slice(0, 5));
    } else {
      setEvidence(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number, type: "contracts" | "evidence") => {
    if (type === "contracts") {
      setContracts(prev => prev.filter((_, i) => i !== index));
    } else {
      setEvidence(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
      toast({
        title: "Dossier soumis",
        description: "Votre dossier a été créé avec succès. L'analyse va commencer.",
      });
      navigate("/dashboard/cases");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/cases">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouveau dossier</h1>
          <p className="text-muted-foreground">Soumettez votre litige pour analyse</p>
        </div>
      </div>

      {/* Stepper */}
      <WizardStepper steps={steps} currentStep={currentStep} />

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Indiquez votre position dans le litige"}
            {currentStep === 2 && "Décrivez les faits et circonstances du litige"}
            {currentStep === 3 && "Téléversez les contrats concernés (1 à 5 fichiers)"}
            {currentStep === 4 && "Ajoutez vos pièces justificatives (optionnel)"}
            {currentStep === 5 && "Vérifiez et validez votre soumission"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Role selection */}
          {currentStep === 1 && (
            <RadioGroup value={role || ""} onValueChange={(v) => setRole(v as CaseRole)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    role === "DEM" ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="DEM" className="mt-1" />
                  <div>
                    <div className="font-medium">Demandeur</div>
                    <div className="text-sm text-muted-foreground">
                      Vous initiez la procédure pour faire valoir vos droits
                    </div>
                  </div>
                </label>
                <label
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    role === "DEF" ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="DEF" className="mt-1" />
                  <div>
                    <div className="font-medium">Défendeur</div>
                    <div className="text-sm text-muted-foreground">
                      Vous répondez à une demande formulée contre vous
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>
          )}

          {/* Step 2: Narrative */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="narrative">Exposé des faits</Label>
                <Textarea
                  id="narrative"
                  placeholder="Décrivez en détail les circonstances du litige, les faits importants, les dates clés et vos attentes..."
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value.slice(0, 5000))}
                  rows={12}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimum 100 caractères</span>
                  <span className={narrative.length < 100 ? "text-destructive" : ""}>
                    {narrative.length} / 5000
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contracts */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("contracts-input")?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium">Cliquez pour téléverser vos contrats</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, DOC, DOCX • Max 10 Mo par fichier • 1 à 5 fichiers
                </p>
                <input
                  id="contracts-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "contracts")}
                />
              </div>

              {contracts.length > 0 && (
                <div className="space-y-2">
                  {contracts.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="flex-1 text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(index, "contracts")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Evidence */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("evidence-input")?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium">Téléversez vos pièces justificatives</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Courriers, emails, factures, photos... • PDF, JPG, PNG
                </p>
                <input
                  id="evidence-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "evidence")}
                />
              </div>

              {evidence.length > 0 && (
                <div className="space-y-2">
                  {evidence.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="flex-1 text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(index, "evidence")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {evidence.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Cette étape est optionnelle. Vous pouvez passer à la validation.
                </p>
              )}
            </div>
          )}

          {/* Step 5: Validation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rôle</span>
                  <span className="font-medium">{role === "DEM" ? "Demandeur" : "Défendeur"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exposé</span>
                  <span className="font-medium">{narrative.length} caractères</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contrats</span>
                  <span className="font-medium">{contracts.length} fichier(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pièces</span>
                  <span className="font-medium">{evidence.length} fichier(s)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                />
                <label htmlFor="accept" className="text-sm leading-relaxed cursor-pointer">
                  Je certifie l'exactitude des informations fournies et j'accepte les{" "}
                  <a href="#" className="text-primary hover:underline">conditions générales</a>{" "}
                  de la plateforme SOLVILO. Je comprends que mon dossier sera analysé par un système d'IA juridique.
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                disabled={!canProceed()}
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={!canProceed()}
              >
                <Check className="h-4 w-4 mr-2" />
                Soumettre le dossier
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la soumission</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir soumettre ce dossier ? Une fois soumis, vous ne pourrez plus modifier les informations initiales.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Envoi...
                </span>
              ) : (
                "Confirmer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
