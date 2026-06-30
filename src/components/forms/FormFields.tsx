import { type ReactNode } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  children?: ReactNode;
  hint?: string;
};

export function FormField({
  label,
  name,
  type = "text",
  required = false,
  children,
  hint,
}: FormFieldProps) {
  if (children) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-muted ml-1">*</span>}
        </label>
        {children}
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-muted ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        className="w-full min-w-0 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  required = false,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-muted ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none resize-y"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  required = false,
  placeholder,
  defaultValue = "",
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-muted ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="w-full min-w-0 min-h-11 px-4 py-3 border border-border bg-background input-base focus:border-foreground focus:outline-none"
        defaultValue={defaultValue}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormNotice() {
  return (
    <p className="text-xs text-muted leading-relaxed">
      Mit dem Absenden stimmst du der Verarbeitung deiner Angaben zur Bearbeitung deiner Anfrage
      gemäß der{" "}
      <a href="/datenschutz#formulare" className="underline hover:no-underline">
        Datenschutzerklärung
      </a>{" "}
      zu. Die Übertragung erfolgt verschlüsselt (SSL/TLS). Es werden keine Tracking-Cookies
      eingesetzt.
    </p>
  );
}

export function SubmitButton({ label = "Absenden" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="w-full min-h-11 sm:w-auto px-8 py-3 bg-foreground text-background font-medium rounded-xl shadow-soft hover:shadow-soft-hover hover:bg-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
    >
      {label}
    </button>
  );
}

type CheckboxProps = {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
};

export function Checkbox({ label, name, checked, onChange, hint }: CheckboxProps) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer min-h-11">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          value="ja"
          className="mt-1 h-4 w-4 shrink-0 rounded border-border text-forest focus:ring-sage"
        />
        <span className="text-sm leading-relaxed">
          <span className="font-medium">{label}</span>
          {hint && <span className="block mt-0.5 text-muted font-normal">{hint}</span>}
        </span>
      </label>
    </div>
  );
}
