import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  invoiced: { label: "Invoiced", className: "bg-blue-100 text-blue-800" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800" },
  gio_briefed: { label: "Gio Briefed", className: "bg-emerald-100 text-emerald-800" },
  completed: { label: "Completed", className: "bg-emerald-200 text-emerald-900" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="secondary" className={`font-sans text-xs ${config.className}`}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
