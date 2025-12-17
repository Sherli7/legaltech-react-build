import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface QuotaProgressProps {
  label: string;
  used: number;
  limit: number;
  className?: string;
}

export function QuotaProgress({ label, used, limit, className }: QuotaProgressProps) {
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  const isWarning = percentage >= 80;
  const isDanger = percentage >= 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          "font-medium",
          isDanger && "text-destructive",
          isWarning && !isDanger && "text-warning-foreground"
        )}>
          {used} / {limit === -1 ? "∞" : limit}
        </span>
      </div>
      <Progress 
        value={Math.min(percentage, 100)} 
        className={cn(
          "h-2",
          isDanger && "[&>div]:bg-destructive",
          isWarning && !isDanger && "[&>div]:bg-warning"
        )}
      />
    </div>
  );
}
