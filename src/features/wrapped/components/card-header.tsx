import type { LucideIcon } from "lucide-react";

type CardHeaderProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconClassName: string;
};

export function CardHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
}: CardHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
      >
        <Icon aria-hidden className="size-4" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
