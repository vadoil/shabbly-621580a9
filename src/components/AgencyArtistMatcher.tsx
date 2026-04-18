import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

const formats = ["Корпоратив", "Свадьба", "Частное мероприятие", "Фестиваль", "Презентация бренда"];
const genres = ["Поп", "Соул / R&B", "Джаз", "Электронная", "Рок", "Кавер-программа"];

const AgencyArtistMatcher = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(322_80%_55%/0.08)_0%,transparent_70%)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-8 md:p-12 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Search size={22} />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Подбор артиста</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter">
                Расскажите о мероприятии — подберём идеального артиста
              </h2>
              <p className="text-muted-foreground">
                Уточните формат и жанр — наши менеджеры предложат варианты в течение 24 часов.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Формат</p>
              <div className="flex flex-wrap gap-2">
                {formats.map((f) => (
                  <span key={f} className="rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Жанры</p>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span key={g} className="rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Link
              to="/artists"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all"
            >
              Открыть каталог артистов <ArrowRight size={14} />
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
            >
              Получить подборку
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencyArtistMatcher;
