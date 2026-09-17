import type { ReactNode } from "react";

const input = "h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none";

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function Input({
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  step,
}: {
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue ?? ""}
      required={required}
      placeholder={placeholder}
      step={step}
      className={input}
    />
  );
}

export function Textarea({ name, defaultValue, rows = 4, placeholder }: { name: string; defaultValue?: string; rows?: number; placeholder?: string }) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue ?? ""}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-xl border border-line bg-white p-3 text-sm focus:border-primary focus:outline-none"
    />
  );
}

export function Checkbox({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-2.5 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-primary" />
      <span>
        <span className="font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

export function Select({ name, defaultValue, options }: { name: string; defaultValue?: string; options: { value: string; label: string }[] }) {
  return (
    <select name={name} defaultValue={defaultValue} className={input}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-card border border-line bg-white p-5 ${className}`}>
      {title ? <h2 className="mb-4 font-display text-lg font-medium">{title}</h2> : null}
      {children}
    </section>
  );
}

export const orderStatuses = ["paid", "packed", "shipped", "delivered", "cancelled", "refunded"] as const;

export const statusLabel: Record<string, string> = {
  pending: "Väntar på betalning",
  paid: "Betald",
  packed: "Packad",
  shipped: "Skickad",
  delivered: "Levererad",
  cancelled: "Avbruten",
  refunded: "Återbetald",
};

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "paid"
      ? "bg-accent-soft text-accent"
      : status === "shipped" || status === "delivered"
        ? "bg-primary-soft text-primary"
        : status === "cancelled" || status === "refunded"
          ? "bg-danger/10 text-danger"
          : "bg-sand text-foreground";
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>{statusLabel[status] ?? status}</span>;
}
