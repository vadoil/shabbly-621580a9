import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Music, Calendar, ShoppingBag } from "lucide-react";
import hero2 from "@/assets/hero/hero-2.jpg";
import hero4 from "@/assets/hero/hero-4.jpg";
import hero5 from "@/assets/hero/hero-5.jpg";
import { useSiteSection } from "@/hooks/use-data";

const images = [hero2, hero4, hero5];

const GlitchHero = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [phase, setPhase] = useState<"idle" | "glitch1" | "glitch2" | "glitch3" | "resolve">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { data: heroTagline } = useSiteSection("hero_tagline");

  const triggerGlitch = useCallback(() => {
    const nextIdx = (current + 1) % images.length;
    setNext(nextIdx);

    // Phase 1: RGB split + scanline distortion
    setPhase("glitch1");

    timerRef.current = setTimeout(() => {
      // Phase 2: horizontal slice tear
      setPhase("glitch2");
    }, 100);

    setTimeout(() => {
      // Phase 3: swap image with brief static
      setPhase("glitch3");
      setCurrent(nextIdx);
    }, 200);

    setTimeout(() => {
      setPhase("resolve");
    }, 280);

    setTimeout(() => {
      setPhase("idle");
    }, 350);
  }, [current]);

  useEffect(() => {
    const interval = setInterval(triggerGlitch, 4000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerGlitch]);

  // Micro flicker
  const [flicker, setFlicker] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.75 && phase === "idle") {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 40 + Math.random() * 60);
      }
    }, 1200);
    return () => clearInterval(id);
  }, [phase]);

  const isGlitching = phase !== "idle";
  const showRGB = isGlitching || flicker;

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-background">
      {/* Base image — object-position: top center so faces are visible */}
      <div className="absolute inset-0">
        <img
          src={images[current]}
          alt=""
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Classic RGB channel split */}
      {showRGB && (
        <>
          {/* Red channel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${images[current]})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              mixBlendMode: "screen",
              opacity: isGlitching ? 0.6 : 0.25,
              transform: `translateX(${isGlitching ? 6 : 2}px)`,
              filter: "saturate(2) hue-rotate(-30deg)",
            }}
          />
          {/* Cyan channel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${images[current]})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              mixBlendMode: "screen",
              opacity: isGlitching ? 0.5 : 0.2,
              transform: `translateX(${isGlitching ? -6 : -2}px)`,
              filter: "saturate(2) hue-rotate(150deg)",
            }}
          />
        </>
      )}

      {/* Horizontal slice tears during glitch */}
      {(phase === "glitch2" || phase === "glitch3") && (
        <>
          {[15, 30, 52, 68, 82].map((top, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 overflow-hidden pointer-events-none"
              style={{
                top: `${top}%`,
                height: `${3 + Math.random() * 4}%`,
                transform: `translateX(${(i % 2 === 0 ? 1 : -1) * (15 + Math.random() * 30)}px)`,
              }}
            >
              <img
                src={images[phase === "glitch3" ? next : current]}
                alt=""
                className="w-full h-full object-cover object-top"
                style={{
                  position: "absolute",
                  top: `-${top}%`,
                  left: 0,
                  width: "100%",
                  height: `${100 / ((3 + 4) / 100)}%`,
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* Scanlines — always subtle, stronger during glitch */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: isGlitching ? 0.08 : 0.03,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.4) 2px,
            rgba(0,0,0,0.4) 4px
          )`,
        }}
      />

      {/* Static noise during glitch */}
      {isGlitching && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Horizontal glitch bars */}
      {isGlitching && (
        <>
          <div className="absolute left-0 right-0 h-[2px] bg-primary/70" style={{ top: "23%" }} />
          <div className="absolute left-0 w-2/5 h-[1px] bg-[hsl(180_80%_55%/0.5)]" style={{ top: "55%" }} />
          <div className="absolute right-0 w-1/3 h-[3px] bg-primary/30" style={{ top: "74%" }} />
        </>
      )}

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />

      {/* Content */}
      <div className="relative z-10 flex items-end min-h-[85vh] pb-16 md:pb-20">
        <div className="container">
          <div className="max-w-2xl space-y-6">
            {/* Title with glitch text shadow */}
            <h1
              className="font-display text-7xl md:text-9xl font-bold tracking-tighter select-none"
              style={{
                textShadow: isGlitching
                  ? "4px 0 hsl(322 80% 55%), -4px 0 hsl(180 80% 55%), 0 2px hsl(322 80% 55% / 0.3)"
                  : flicker
                  ? "2px 0 hsl(322 80% 55% / 0.4), -2px 0 hsl(180 80% 55% / 0.4)"
                  : "none",
                transform: isGlitching ? "translateX(2px)" : "none",
                transition: "transform 0.05s",
              }}
            >
              <span className="text-gradient-fuchsia">SHABBLY</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/80 max-w-lg leading-relaxed">
              {heroTagline?.content || "Люди, влюблённые в музыку — это диагноз. Разрешим себе быть профессионалами в любви к музыке."}
            </p>

            {/* Navigation buttons */}
            <div className="flex gap-3 flex-wrap pt-2">
              <Link
                to="/music"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(322_80%_55%/0.4)] transition-all"
              >
                <Music size={16} /> Слушать
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/30 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-foreground hover:border-primary/60 hover:bg-primary/10 transition-all"
              >
                <Calendar size={16} /> Афиша
              </Link>
              <Link
                to="/merch"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/30 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-foreground hover:border-primary/60 hover:bg-primary/10 transition-all"
              >
                <ShoppingBag size={16} /> Мерч
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlitchHero;
