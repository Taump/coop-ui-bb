function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b px-2 py-3">
      <Pulse className="h-4 w-8" />
      <Pulse className="h-4 w-32" />
      <Pulse className="ml-auto h-4 w-24" />
      <Pulse className="h-4 w-16" />
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 border-b px-2 py-3">
        <Pulse className="h-4 w-6" />
        <Pulse className="h-4 w-16" />
        <Pulse className="ml-auto h-4 w-16" />
        <Pulse className="h-4 w-12" />
      </div>
      {Array.from({ length: 10 }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
