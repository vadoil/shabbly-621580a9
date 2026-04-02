import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

const EmptyState = ({ icon: Icon, title, description, ctaLabel, ctaLink }: EmptyStateProps) => (
  <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
    <Icon size={48} className="mx-auto text-muted-foreground/20 mb-4" />
    <p className="font-display font-semibold text-muted-foreground">{title}</p>
    {description && <p className="text-sm text-muted-foreground/60 mt-1">{description}</p>}
    {ctaLabel && ctaLink && (
      <Link to={ctaLink} className="inline-flex items-center mt-4 text-sm font-medium text-primary hover:underline">
        {ctaLabel} →
      </Link>
    )}
  </div>
);

export default EmptyState;
