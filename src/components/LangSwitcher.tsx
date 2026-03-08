import { useLang, LANG_OPTIONS } from "@/lib/i18n";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex gap-1 bg-card/80 backdrop-blur border border-border rounded-full p-1">
      {LANG_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLang(opt.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            lang === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
