import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const AgencyHero = () => {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(322_80%_55%/0.18)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(280_70%_50%/0.12)_0%,transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container relative z-10 py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: copy */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
            <Sparkles size={12} />
            Музыкальное продюсерское агентство
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter">
            Артисты,
            <br />
            которые создают
            <br />
            <span className="text-gradient-fuchsia">атмосферу</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Подбираем артистов, продюсируем live-шоу и закрываем мероприятия под ключ —
            от приватного ужина до корпоративного фестиваля.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/contacts"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all"
            >
              Оставить заявку
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/artists"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-card transition-all"
            >
              Подобрать артиста
            </Link>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50 max-w-xl">
            <div>
              <p className="font-display text-3xl font-bold text-gradient-fuchsia">120+</p>
              <p className="text-xs text-muted-foreground mt-1">мероприятий в год</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gradient-fuchsia">50+</p>
              <p className="text-xs text-muted-foreground mt-1">артистов в ростере</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gradient-fuchsia">8</p>
              <p className="text-xs text-muted-foreground mt-1">лет на сцене</p>
            </div>
          </div>
        </div>

        {/* Right: visual frame */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative aspect-[4/5] rounded-3xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden glow-fuchsia">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, hsl(var(--primary)) 0 1px, transparent 1px 4px)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary">SHABBLY × Live</p>
              <p className="font-display text-2xl font-bold leading-tight">
                Премиальный live-experience для вашего бренда
              </p>
            </div>
            <div className="absolute top-6 right-6 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-[10px] font-medium uppercase tracking-wider border border-border">
              B2B
            </div>
          </div>
          {/* Floating accent */}
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl border border-primary/40 bg-primary/5 backdrop-blur-sm rotate-12" />
        </div>
      </div>
    </section>
  );
};

export default AgencyHero;
