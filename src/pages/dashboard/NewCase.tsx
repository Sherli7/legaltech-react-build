import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, X, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { cn, formatBytes, validateFile } from "@/lib/utils";
import type { CaseRole, DraftCase, UploadedFile } from "@/types";
import { casesService } from "@/services";

const steps: WizardStep[] = [
  { id: 1, title: "Role", description: "Votre position" },
  { id: 2, title: "Expose", description: "Les faits" },
  { id: 3, title: "Contrats", description: "Documents" },
  { id: 4, title: "Pieces", description: "Justificatifs" },
  { id: 5, title: "Validation", description: "Signature" },
];

const CONTRACT_LIMIT = 5;
const EVIDENCE_LIMIT = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
const CONTRACT_TYPES = ["pdf", "doc", "docx"];
const EVIDENCE_TYPES = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];

const sanitizeHtml = (html: string) => html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
const htmlToPlainText = (html: string) => {
  if (typeof window === "undefined") return html;
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

type RichTextEditorProps = {
  value: string;
  onChange: (html: string, plain: string) => void;
  placeholder?: string;
};

function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    const html = sanitizeHtml(editorRef.current?.innerHTML || "");
    const plain = htmlToPlainText(html);
    onChange(html, plain);
  };

  const applyCommand = (command: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, "");
    handleInput();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-muted/50">
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => applyCommand("bold")}>
          <strong>B</strong>
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 italic" onClick={() => applyCommand("italic")}>
          I
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 underline" onClick={() => applyCommand("underline")}>
          U
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => applyCommand("insertUnorderedList")}>
          •
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => applyCommand("insertOrderedList")}>
          1.
        </Button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[240px] rounded-md border bg-background px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 prose prose-sm max-w-none"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
        }
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 0.25rem 0;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin: 0.25rem 0;
        }
        [contenteditable] li {
          margin: 0.15rem 0;
        }
        [contenteditable] p {
          margin: 0.35rem 0;
        }
      `}</style>
    </div>
  );
}
export default function NewCase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string>("local-draft");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [role, setRole] = useState<CaseRole | null>(null);
  const [narrative, setNarrative] = useState("");
  const [narrativeHtml, setNarrativeHtml] = useState<string>("<p></p>");
  const [contracts, setContracts] = useState<UploadedFile[]>([]);
  const [evidence, setEvidence] = useState<UploadedFile[]>([]);
  const [accepted, setAccepted] = useState(false);

  const hasUploadsInFlight = useMemo(
    () => [...contracts, ...evidence].some((f) => f.status === "uploading"),
    [contracts, evidence]
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1: return role !== null;
      case 2: return narrative.length >= 100;
      case 3: return contracts.length >= 1 && !hasUploadsInFlight;
      case 4: return !hasUploadsInFlight; // Evidence is optional
      case 5: return accepted && !hasUploadsInFlight && contracts.every((c) => c.status === "uploaded");
      default: return false;
    }
  };

  const maxFiles = (type: "contracts" | "evidence") => (type === "contracts" ? CONTRACT_LIMIT : EVIDENCE_LIMIT);
  const allowedTypes = (type: "contracts" | "evidence") => (type === "contracts" ? CONTRACT_TYPES : EVIDENCE_TYPES);

  const simulateUpload = (file: UploadedFile, type: "contracts" | "evidence") => {
    // Placeholder for a real upload request
    setTimeout(() => {
      const updater = type === "contracts" ? setContracts : setEvidence;
      updater((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "uploaded" } : f))
      );
    }, 800 + Math.random() * 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "contracts" | "evidence") => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const current = type === "contracts" ? contracts : evidence;
    const remainingSlots = maxFiles(type) - current.length;
    const acceptedFiles = files.slice(0, Math.max(remainingSlots, 0));
    const rejectedBecauseCount = files.length > remainingSlots && remainingSlots >= 0;

    const validationErrors: string[] = [];
    const uploadsToAdd: UploadedFile[] = [];

    acceptedFiles.forEach((file) => {
      const errors = validateFile(file, { maxSize: MAX_FILE_SIZE, allowedTypes: allowedTypes(type) });
      if (errors.length > 0) {
        validationErrors.push(`${file.name} : ${errors.join(", ")}`);
        return;
      }
      const entry: UploadedFile = {
        id: `${type}_${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        kind: type === "contracts" ? "contract" : "evidence",
        status: "uploading",
      };
      uploadsToAdd.push(entry);

      casesService.uploadFile(file, type === "contracts" ? "contract" : "evidence")
        .then((uploaded) => {
          const updater = type === "contracts" ? setContracts : setEvidence;
          updater((prev) =>
            prev.map((f) => (f.id === entry.id ? { ...uploaded } : f))
          );
        })
        .catch(() => {
          const updater = type === "contracts" ? setContracts : setEvidence;
          updater((prev) =>
            prev.map((f) => (f.id === entry.id ? { ...f, status: "error" } : f))
          );
          toast({
            variant: "destructive",
            title: "Echec de l'upload",
            description: file.name,
          });
        });
    });

    if (validationErrors.length) {
      toast({
        variant: "destructive",
        title: "Certains fichiers ont été rejetés",
        description: validationErrors.join(" | "),
      });
    }

    if (rejectedBecauseCount) {
      toast({
        variant: "destructive",
        title: "Limite atteinte",
        description: `Vous ne pouvez ajouter que ${maxFiles(type)} ${type === "contracts" ? "contrat(s)" : "pièce(s)"} maximum.`,
      });
    }

    if (uploadsToAdd.length) {
      const updater = type === "contracts" ? setContracts : setEvidence;
      updater((prev) => [...prev, ...uploadsToAdd]);
      toast({
        title: "Fichiers ajoutés",
        description: `${uploadsToAdd.length} fichier(s) en cours d'upload.`,
      });
    }

    e.target.value = "";
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
    try {
      const payload: DraftCase = {
        id: draftId,
        role,
        narrative,
        narrativeHtml,
        contracts,
        evidence,
        accepted,
        updatedAt: new Date().toISOString(),
      };
      const saved = await casesService.saveDraft(payload);
      setDraftId(saved.id);
      await casesService.submitDraft(saved.id);
      setShowConfirmDialog(false);
      toast({
        title: "Dossier soumis",
        description: "Votre dossier a ete cree avec succes. L'analyse va commencer.",
      });
      navigate("/dashboard/cases");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Echec de la soumission",
        description: error?.message || "Une erreur est survenue",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hydrateDraft = () => {
    casesService.getDraft().then((draft) => {
      if (!draft) return;
      setDraftId(draft.id || "local-draft");
      setRole(draft.role);
      const plain = draft.narrative || htmlToPlainText(draft.narrativeHtml || "");
      setNarrative(plain);
      setNarrativeHtml(draft.narrativeHtml || draft.narrative || "<p></p>");
      setContracts(draft.contracts || []);
      setEvidence(draft.evidence || []);
      setAccepted(draft.accepted || false);
      setLastSavedAt(draft.updatedAt || null);
    }).catch(() => {
      // no existing draft
    });
  };
  const persistDraft = (instant = false) => {
    const payload: DraftCase = {
      id: draftId,
      role,
      narrative,
      narrativeHtml,
      contracts,
      evidence,
      accepted,
      updatedAt: new Date().toISOString(),
    };

    const save = () => {
      setIsSavingDraft(true);
      casesService.saveDraft(payload)
        .then((saved) => {
          setDraftId(saved.id);
          setLastSavedAt(saved.updatedAt);
        })
        .catch((error: any) => {
          console.error("Unable to save draft", error);
          toast({
            variant: "destructive",
            title: "Sauvegarde brouillon echouee",
            description: error?.message || "Veuillez reessayer",
          });
        })
        .finally(() => setIsSavingDraft(false));
    };

    if (instant) {
      save();
      return;
    }

    const timeout = setTimeout(save, 800);
    return () => clearTimeout(timeout);
  };


  useEffect(() => {
    hydrateDraft();
  }, []);

  useEffect(() => {
    const cancel = persistDraft();
    return () => {
      if (typeof cancel === "function") cancel();
    };
  }, [role, narrative, narrativeHtml, contracts, evidence, accepted]);

  const formattedSaveTime = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : null;

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
            {currentStep === 2 && "Decrivez les faits et circonstances du litige"}
            {currentStep === 3 && "Televersez les contrats concernes (1 a 5 fichiers)"}
            {currentStep === 4 && "Ajoutez vos pieces justificatives (optionnel)"}
            {currentStep === 5 && "Verifiez et validez votre soumission"}
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
                      Vous initiez la procedure pour faire valoir vos droits
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
                    <div className="font-medium">Defendeur</div>
                    <div className="text-sm text-muted-foreground">
                      Vous repondez a une demande formulee contre vous
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
                <Label htmlFor="narrative">Expose des faits</Label>
                <RichTextEditor
                  value={narrativeHtml}
                  placeholder="Decrivez en detail les circonstances du litige, les faits importants, les dates cles et vos attentes..."
                  onChange={(html, plain) => {
                    setNarrativeHtml(html);
                    setNarrative(plain.slice(0, 5000));
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimum 100 caracteres</span>
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
                <p className="font-medium">Cliquez pour televerser vos contrats</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, DOC, DOCX · Max 10 Mo par fichier · {contracts.length}/{CONTRACT_LIMIT}
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
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(file.size)} · {file.status === "uploaded" ? "Uploade" : "En cours..."}
                        </p>
                      </div>
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
                <p className="font-medium">Televersez vos pieces justificatives</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Courriers, emails, factures, photos... · PDF, JPG, PNG · {evidence.length}/{EVIDENCE_LIMIT}
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
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(file.size)} · {file.status === "uploaded" ? "Uploade" : "En cours..."}
                        </p>
                      </div>
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
                  Cette etape est optionnelle. Vous pouvez passer a la validation.
                </p>
              )}
            </div>
          )}

          {/* Step 5: Validation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{role === "DEM" ? "Demandeur" : "Defendeur"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expose</span>
                  <span className="font-medium">{narrative.length} caracteres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contrats</span>
                  <span className="font-medium">{contracts.length} fichier(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pieces</span>
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
                  <a href="#" className="text-primary hover:underline">conditions generales</a>{" "}
                  de la plateforme SOLVILO. Je comprends que mon dossier sera analyse par un systeme d'IA juridique.
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
              Precedent
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
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => persistDraft(true)} disabled={isSavingDraft}>
                  {isSavingDraft ? "Sauvegarde..." : "Enregistrer le brouillon"}
                </Button>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!canProceed()}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Soumettre le dossier
                </Button>
              </div>
            )}
          </div>

          {formattedSaveTime && (
            <p className="text-xs text-muted-foreground text-right">
              Brouillon sauvegarde a {formattedSaveTime}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la soumission</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir soumettre ce dossier ? Une fois soumis, vous ne pourrez plus modifier les informations initiales.
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
