import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroArtist from "@/assets/hero-artist.jpg";

const AgencyHero = () => {
  return (
    <section className="relative overflow-hidden flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Mobile: photo as atmospheric background */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src={heroArtist}
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-[center_25%] opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(322_80%_55%/0.25)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(280_70%_50%/0.18)_0%,transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container relative z-10 py-20 lg:py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: copy */}
        <div className="lg:col-span-7 space-y-6 lg:space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
            <Sparkles size={12} />
            <span className="hidden sm:inline">Музыкальное продюсерское агентство</span>
            <span className="sm:hidden">Продюсерское агентство</span>
          </div>

          <h1 className="font-art text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight">
            Артисты,
            <br />
            которые создают
            <br />
            <span className="text-gradient-fuchsia font-bold">атмосферу</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Подбираем артистов, ставим концертные программы и проводим мероприятия под ключ —
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
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 lg:pt-8 border-t border-border/50 max-w-xl">
            <div>
              <p className="font-art text-2xl sm:text-3xl font-bold text-gradient-fuchsia">120+</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">мероприятий в год</p>
            </div>
            <div>
              <p className="font-art text-2xl sm:text-3xl font-bold text-gradient-fuchsia">50+</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">артистов в составе</p>
            </div>
            <div>
              <p className="font-art text-2xl sm:text-3xl font-bold text-gradient-fuchsia">8</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">лет на сцене</p>
            </div>
          </div>
        </div>

        {/* Right: visual frame (desktop only) */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative aspect-[4/5] rounded-3xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden glow-fuchsia group">
            <img
              src={heroArtist}
              alt="Артист SHABBLY на сцене во время живого выступления"
              width={1024}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20 mix-blend-overlay" />
            <div
              className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, hsl(var(--primary)) 0 1px, transparent 1px 4px)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background)/0.6)_100%)]" />

            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 z-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold">
                SHABBLY × Live
              </p>
              <p className="font-art text-2xl font-bold leading-tight">
                Премиальный live-experience для вашего бренда
              </p>
            </div>

            <div className="absolute top-6 right-6 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-[10px] font-medium uppercase tracking-wider border border-border z-10">
              B2B
            </div>
            <div className="absolute top-6 left-6 flex items-center gap-1.5 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
              LIVE
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl border border-primary/40 bg-primary/5 backdrop-blur-sm rotate-12" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default AgencyHero;
