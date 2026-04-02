interface Props {
  variant?: "card" | "list" | "hero";
  count?: number;
}

const LoadingSkeleton = ({ variant = "card", count = 3 }: Props) => {
  if (variant === "hero") {
    return <div className="h-[60vh] animate-pulse bg-secondary/30 rounded-lg" />;
  }
  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-secondary/50 animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="aspect-square rounded-lg bg-secondary/50" />
          <div className="h-4 w-2/3 rounded bg-secondary/50" />
          <div className="h-3 w-1/3 rounded bg-secondary/30" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
