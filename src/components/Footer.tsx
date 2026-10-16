import { Link } from "react-router-dom";
import { useLang } from "@/lib/i18n";

export default function Footer({ className = "mt-12" }: { className?: string }) {
  const { t } = useLang();

  return (
    <footer className={`w-full mb-4 flex flex-col items-center gap-2 text-center ${className}`}>
      <nav aria-label="Legal" className="flex items-center gap-3 text-xs">
        <Link
          to="/terms"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("termsOfService")}
        </Link>
        <span aria-hidden="true" className="text-muted-foreground/40">|</span>
        {/* 개인정보 보호법 시행령 제31조: 처리방침은 다른 고지사항과 구분되도록 글자 굵기·색상으로 강조 */}
        <Link
          to="/privacy"
          className="font-bold text-primary hover:brightness-125 transition-all"
        >
          {t("privacyPolicy")}
        </Link>
      </nav>
      <a
        href="https://litt.ly/chichiboo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        created by. 교육뮤지컬 꿈꾸는 치수쌤
      </a>
    </footer>
  );
}
