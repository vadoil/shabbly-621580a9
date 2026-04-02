import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Music, Calendar, Camera } from "lucide-react";
import hero2 from "@/assets/hero/hero-2.jpg";
import hero4 from "@/assets/hero/hero-4.jpg";
import hero5 from "@/assets/hero/hero-5.jpg";

const images = [hero2, hero4, hero5];

const GlitchHero = () => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  // Crossfade slideshow every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % images.length);
        setFading(false);
      }, 1200);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Glitch trigger every 4-6 seconds
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const fire = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 250);
      const next = 4000 + Math.random() * 2000;
      setTimeout(fire, next);
    };
    const t = setTimeout(fire, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={`relative min-h-[100vh] md:min-h-[85vh] overflow-hidden bg-background flex items-end md:items-end ${fading ? "hero-img-glitch" : ""}`}>
      {/* === Background images with crossfade === */}
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === current && !fading ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover object-[center_30%] md:block hidden"
          />
          {/* Mobile: single centered image */}
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover object-[center_20%] md:hidden block"
          />
        </div>
      ))}

      {/* RGB split layers during transition */}
      {fading && (
        <>
          <div
            className="absolute inset-0 z-[1] mix-blend-screen opacity-60 animate-[glitch-shift-1_0.3s_steps(2)_infinite]"
            style={{ background: `url(${images[(current + 1) % images.length]}) center/cover no-repeat`, filter: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22r%22><feColorMatrix type=%22matrix%22 values=%221 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0%22/></filter></svg>#r')" }}
          />
          <div
            className="absolute inset-0 z-[1] mix-blend-screen opacity-60 animate-[glitch-shift-2_0.25s_steps(2)_infinite]"
            style={{ background: `url(${images[(current + 1) % images.length]}) center/cover no-repeat`, filter: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22b%22><feColorMatrix type=%22matrix%22 values=%220 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0%22/></filter></svg>#b')" }}
          />
        </>
      )}

      {/* === Noise overlay === */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* === Scanlines === */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-[0.035]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)`,
        }}
      />

      {/* === Darken gradient === */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-background/60 via-background/30 to-background" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-background/70 via-transparent to-background/30 hidden md:block" />

      {/* === Content === */}
      <div className="relative z-10 container pb-16 md:pb-20 pt-32 md:pt-0">
        <div className="max-w-2xl space-y-5 text-center md:text-left">
          {/* H1 with glitch */}
          <h1
            className={`font-display text-6xl sm:text-7xl md:text-9xl font-bold tracking-tighter select-none ${glitch ? "hero-glitch-active" : ""}`}
          >
            <span className="text-gradient-fuchsia hero-glitch-text" data-text="SHABBLY">
              SHABBLY
            </span>
          </h1>

          <p className="text-lg md:text-xl text-primary/80 font-medium tracking-wide uppercase">
            голос внутренней свободы
          </p>

          <p className="text-sm md:text-base text-foreground/70 max-w-lg leading-relaxed mx-auto md:mx-0">
            Песни о чувствах без цензуры: любовь, злость, смех над собой — и&nbsp;шаг дальше.
            Музыка, которая звучит как честный разговор в&nbsp;темноте.
          </p>

          {/* CTA */}
          <div className="flex gap-3 justify-center md:justify-start flex-col sm:flex-row pt-2">
            <Link
              to="/music"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(322_80%_55%/0.4)] transition-all"
            >
              <Music size={16} /> Слушать релизы
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-background/30 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground hover:border-primary/60 hover:bg-primary/10 transition-all"
            >
              <Calendar size={16} /> Афиша / билеты
            </Link>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors pt-1"
          >
            <Camera size={12} /> Смотреть фото
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GlitchHero;
