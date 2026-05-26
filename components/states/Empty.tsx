import type { ReactNode } from "react";

export function Empty({
  title,
  subtitle,
  icon,
  cta,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  cta?: ReactNode;
}) {
  return (
    <div className="panel p-10 text-center space-y-3 max-w-md mx-auto">
      {icon && <div className="size-12 mx-auto rounded-lg bg-surface2 flex items-center justify-center text-ink-dim">{icon}</div>}
      <div className="text-[14px] font-medium text-ink">{title}</div>
      {subtitle && <div className="text-[12px] text-ink-mute leading-relaxed">{subtitle}</div>}
      {cta && <div className="pt-1">{cta}</div>}
    </div>
  );
}
