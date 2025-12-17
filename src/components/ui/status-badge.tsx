import { cn } from "@/lib/utils";
import type { CaseStatus, SubscriptionStatus } from "@/types";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "info" | "muted";

const caseStatusConfig: Record<CaseStatus, { label: string; variant: BadgeVariant }> = {
  draft: { label: "Brouillon", variant: "muted" },
  submitted: { label: "Soumis", variant: "info" },
  clarification: { label: "Éclaircissement", variant: "warning" },
  analysis: { label: "Analyse", variant: "info" },
  settlement: { label: "Négociation", variant: "warning" },
  signed: { label: "Signé", variant: "success" },
  closed: { label: "Clôturé", variant: "muted" },
};

const subscriptionStatusConfig: Record<SubscriptionStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: "Actif", variant: "success" },
  expired: { label: "Expiré", variant: "destructive" },
  canceled: { label: "Annulé", variant: "muted" },
  quota_reached: { label: "Quota atteint", variant: "warning" },
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  muted: "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  status: CaseStatus | SubscriptionStatus;
  type: "case" | "subscription";
  className?: string;
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const config = type === "case" 
    ? caseStatusConfig[status as CaseStatus]
    : subscriptionStatusConfig[status as SubscriptionStatus];

  return (
    <span className={cn(
      "status-badge",
      variantStyles[config.variant],
      className
    )}>
      {config.label}
    </span>
  );
}
