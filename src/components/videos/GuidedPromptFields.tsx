import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const set = (key: keyof GuidedPrompt, val: string) => onChange({ ...value, [key]: val });
  const [showNote, setShowNote] = useState(false);
  const optional = t("editPrompt.guided.optional");
  const placeholder = t("editPrompt.guided.placeholder");
  const optionLabels = t("editPrompt.optionLabels", { returnObjects: true }) as {
    sectors: string[];
    productTypes: string[];
    backgrounds: string[];
    themes: string[];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <Field label={t("editPrompt.guided.sector")} hint={optional}>
          <SelectField value={value.sector} placeholder={placeholder} options={SECTOR_OPTIONS} optionLabels={optionLabels.sectors} onChange={(v) => set("sector", v)} />
        </Field>
        <Field label={t("editPrompt.guided.productType")} hint={optional}>
          <SelectField value={value.productType} placeholder={placeholder} options={PRODUCT_TYPE_OPTIONS} optionLabels={optionLabels.productTypes} onChange={(v) => set("productType", v)} />
        </Field>
        <Field label={t("editPrompt.guided.background")} hint={optional}>
          <SelectField value={value.background} placeholder={placeholder} options={BACKGROUND_OPTIONS} optionLabels={optionLabels.backgrounds} onChange={(v) => set("background", v)} />
        </Field>
        <Field label={t("editPrompt.guided.theme")} hint={optional}>
          <SelectField
            value={value.theme}
            placeholder={placeholder}
            options={THEME_OPTIONS}
            optionLabels={optionLabels.themes}
            onChange={(v) => {
              set("theme", v);
              if (v && !value.themeCustom) set("themeCustom", v);
            }}
          />
        </Field>
      </div>

      {showNote || value.themeCustom ? (
        <Field label={t("editPrompt.guided.themeNote")} hint={t("editPrompt.guided.themeNoteHint")}>
          <textarea
            autoFocus={showNote && !value.themeCustom}
            value={value.themeCustom}
            onChange={(e) => set("themeCustom", e.target.value)}
            maxLength={100}
            rows={2}
            placeholder={t("editPrompt.guided.themeNotePlaceholder")}
            className={cn(
              "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
              "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20",
            )}
          />
          {value.themeCustom.length > 0 && (
            <p className="mt-1 text-right text-[10px] text-muted-foreground/60">
              {value.themeCustom.length} / 100
            </p>
          )}
        </Field>
      ) : (
        <button
          type="button"
          onClick={() => setShowNote(true)}
          className="text-xs text-muted-foreground/60 underline-offset-2 hover:text-muted-foreground hover:underline"
        >
          {t("editPrompt.guided.addNote")}
        </button>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
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
  optionLabels,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: string[];
  optionLabels: string[];
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
      {options.map((opt, index) => (
        <option key={opt} value={opt}>{optionLabels[index] ?? opt}</option>
      ))}
    </select>
  );
}
