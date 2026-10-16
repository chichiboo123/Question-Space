import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StarField from "@/components/StarField";
import LangSwitcher from "@/components/LangSwitcher";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/i18n";

interface LegalLayoutProps {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}

export default function LegalLayout({ title, effectiveDate, children }: LegalLayoutProps) {
  const navigate = useNavigate();
  const { t, lang } = useLang();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      <div className="relative z-10 px-4 py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} /> {t("home")}
          </button>
          <LangSwitcher />
        </div>

        <h1 className="text-3xl text-center mb-2 text-primary">{title}</h1>
        <p className="text-sm text-center text-muted-foreground mb-6">
          {t("effectiveDate")}: {effectiveDate}
        </p>

        {lang !== "ko" && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 mb-6">
            {t("legalKoreanNotice")}
          </p>
        )}

        <article lang="ko" className="legal-doc bg-card/80 backdrop-blur border border-border rounded-2xl p-5 sm:p-8">
          {children}
        </article>

        <Footer />
      </div>
    </div>
  );
}
