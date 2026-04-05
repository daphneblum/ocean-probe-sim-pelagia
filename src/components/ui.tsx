import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  className,
  headerRight,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "panel-surface rounded-[1.6rem] border border-white/10 p-5 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-white">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          ) : null}
        </div>
        {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function StatPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border-rose-400/30 bg-rose-400/10 text-rose-100"
      : tone === "warning"
        ? "border-amber-300/30 bg-amber-300/10 text-amber-50"
        : "border-cyan-300/20 bg-cyan-300/10 text-cyan-50";

  return (
    <div className={cn("telemetry-tile rounded-[1.15rem] border px-4 py-3", toneClass)}>
      <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
        {label}
      </p>
      <p className="mt-1.5 text-lg font-semibold">{value}</p>
    </div>
  );
}
