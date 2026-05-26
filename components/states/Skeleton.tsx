export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={"bg-surface2/40 rounded-md animate-pulse " + className} style={style} />;
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={"space-y-2 " + className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={i === lines - 1 ? "h-3 w-2/3" : "h-3 w-full"} />
      ))}
    </div>
  );
}

export function SkeletonRows({ rows = 5, height = 56 }: { rows?: number; height?: number }) {
  return (
    <div className="panel divide-y divide-line overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="rounded-none" style={{ height }} />
      ))}
    </div>
  );
}
