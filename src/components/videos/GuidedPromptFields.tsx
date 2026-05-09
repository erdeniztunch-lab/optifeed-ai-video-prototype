import { cn } from "@/lib/utils";
import { type GuidedPrompt } from "@/types/video-flow";
import {
  BACKGROUND_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  SECTOR_OPTIONS,
  THEME_OPTIONS,
} from "@/data/guidedPromptOptions";

interface GuidedPromptFieldsProps {
  value: GuidedPrompt;
  onChange: (v: GuidedPrompt) => void;
}

export function GuidedPromptFields({ value, onChange }: GuidedPromptFieldsProps) {
  const set = (key: keyof GuidedPrompt, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Sector */}
        <Field label="Sektör" hint="İsteğe bağlı">
          <SelectField
            value={value.sector}
            placeholder="Sektör seçin..."
            options={SECTOR_OPTIONS}
            onChange={(v) => set("sector", v)}
          />
        </Field>

        {/* Product type */}
        <Field label="Ürün tipi" hint="İsteğe bağlı">
          <SelectField
            value={value.productType}
            placeholder="Ürün tipi seçin..."
            options={PRODUCT_TYPE_OPTIONS}
            onChange={(v) => set("productType", v)}
          />
        </Field>

        {/* Background */}
        <Field label="Background / konsept" hint="İsteğe bağlı">
          <SelectField
            value={value.background}
            placeholder="Background seçin..."
            options={BACKGROUND_OPTIONS}
            onChange={(v) => set("background", v)}
          />
        </Field>

        {/* Theme preset */}
        <Field label="Tema / kampanya bağlamı" hint="İsteğe bağlı">
          <SelectField
            value={value.theme}
            placeholder="Tema seçin..."
            options={THEME_OPTIONS}
            onChange={(v) => {
              set("theme", v);
              if (v && !value.themeCustom) set("themeCustom", v);
            }}
          />
        </Field>
      </div>

      {/* Custom theme free-text */}
      <Field label="Serbest tema notu" hint="İsteğe bağlı — özel ifadeler, malzeme detayı, kampanya arka planı">
        <textarea
          value={value.themeCustom}
          onChange={(e) => set("themeCustom", e.target.value)}
          maxLength={200}
          rows={2}
          placeholder="Örn. süet, tokalı, babet — Dubai koleksiyonu için dinamik arka plan"
          className={cn(
            "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
            "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20",
          )}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground/60">
          {value.themeCustom.length} / 200
        </p>
      </Field>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground/60">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function SelectField({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
        "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20",
        !value && "text-muted-foreground",
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
