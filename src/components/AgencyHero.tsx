import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import heroArtist from "@/assets/hero-artist.jpg";
import heroArtistMale from "@/assets/hero-artist-male.jpg";
import heroArtistBand from "@/assets/hero-artist-band.jpg";

const heroSlides = [
  { src: heroArtist, alt: "Вокалистка SHABBLY на сцене во время живого выступления" },
  { src: heroArtistMale, alt: "Эмоциональное выступление вокалиста на концерте SHABBLY" },
  { src: heroArtistBand, alt: "Группа SHABBLY на сцене во время живого выступления" },
];

const AgencyHero = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => {
        setPrev(p);
        setFlashKey((k) => k + 1);
        return (p + 1) % heroSlides.length;
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[calc(100svh-4rem)] flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Mobile: photo as atmospheric background (cycles too) */}
      <div className="absolute inset-0 lg:hidden overflow-hidden">
        {heroSlides.map((s, i) => {
          const isActive = i === active;
          const isPrev = i === prev;
          return (
            <img
              key={s.src}
              src={s.src}
              alt=""
              aria-hidden
              className={`absolute inset-0 w-full h-full object-cover object-[center_25%] opacity-40 ${
                isActive ? "hero-slide-active" : isPrev ? "hero-slide-prev" : ""
              }`}
              style={{
                opacity: isActive ? 0.4 : isPrev ? 0.4 : 0,
              }}
            />
          );
        })}
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

      <div className="container relative z-10 py-10 md:py-12 lg:py-14 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left: copy */}
        <div className="lg:col-span-7 space-y-4 md:space-y-5 lg:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
            <Sparkles size={12} />
            <span className="hidden sm:inline">Музыкальное продюсерское агентство</span>
            <span className="sm:hidden">Продюсерское агентство</span>
          </div>

          <h1 className="font-art text-[1.875rem] sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.5rem] font-semibold leading-[1.05] sm:leading-[1] tracking-tight">
            Артисты, которые создают{" "}
            <span className="text-gradient-fuchsia font-bold">атмосферу</span>
          </h1>

          <p className="text-base md:text-lg xl:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Подбираем артистов, ставим концертные программы и проводим мероприятия под ключ —
            от приватного ужина до корпоративного фестиваля.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
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
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 lg:pt-5 border-t border-border/50 max-w-xl">
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
            {/* Slide stack with diagonal clip-path reveal */}
            {heroSlides.map((s, i) => {
              const isActive = i === active;
              const isPrev = i === prev;
              return (
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  width={1024}
                  height={1280}
                  className={`absolute inset-0 w-full h-full object-cover ${
                    isActive
                      ? "hero-slide-active"
                      : isPrev
                      ? "hero-slide-prev"
                      : "opacity-0"
                  }`}
                  style={{
                    transform: isActive ? "scale(1.05)" : isPrev ? "scale(1.05)" : "scale(1.05)",
                  }}
                />
              );
            })}

            {/* Pink flash sweep across the seam */}
            <div
              key={flashKey}
              className="hero-flash absolute inset-y-0 left-0 w-1/3 z-[3] pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.55) 50%, transparent 100%)",
                mixBlendMode: "screen",
                filter: "blur(8px)",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-[4]" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20 mix-blend-overlay z-[4]" />
            <div
              className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none z-[4]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, hsl(var(--primary)) 0 1px, transparent 1px 4px)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background)/0.6)_100%)] z-[4]" />

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

            {/* Slide indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {heroSlides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === active ? "w-6 bg-primary" : "w-1.5 bg-foreground/30"
                  }`}
                />
              ))}
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
