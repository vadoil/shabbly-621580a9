import { useState, useEffect, useCallback } from "react";
import hero1 from "@/assets/hero/hero-1.jpg";
import hero2 from "@/assets/hero/hero-2.jpg";
import hero3 from "@/assets/hero/hero-3.jpg";
import hero4 from "@/assets/hero/hero-4.jpg";
import hero5 from "@/assets/hero/hero-5.jpg";

const images = [hero1, hero2, hero3, hero4, hero5];

const GlitchHero = () => {
  const [current, setCurrent] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [slices, setSlices] = useState<number[]>([]);

  const triggerGlitch = useCallback(() => {
    setGlitching(true);
    // Generate random horizontal slice offsets
    const newSlices = Array.from({ length: 12 }, () =>
      (Math.random() - 0.5) * 60
    );
    setSlices(newSlices);

    setTimeout(() => {
      setSlices(Array.from({ length: 12 }, () => (Math.random() - 0.5) * 40));
    }, 80);

    setTimeout(() => {
      setSlices(Array.from({ length: 12 }, () => (Math.random() - 0.5) * 80));
      setCurrent((p) => (p + 1) % images.length);
    }, 150);

    setTimeout(() => {
      setSlices(Array.from({ length: 12 }, () => (Math.random() - 0.5) * 20));
    }, 220);

    setTimeout(() => {
      setGlitching(false);
      setSlices([]);
    }, 300);
  }, []);

  useEffect(() => {
    const interval = setInterval(triggerGlitch, 3500);
    return () => clearInterval(interval);
  }, [triggerGlitch]);

  // Mini random glitch flickers
  const [flicker, setFlicker] = useState(false);
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 50 + Math.random() * 100);
      }
    }, 800);
    return () => clearInterval(flickerInterval);
  }, []);

  const sliceCount = 12;
  const sliceHeight = 100 / sliceCount;

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-background">
      {/* Main image with glitch slices */}
      <div className="absolute inset-0">
        {glitching && slices.length > 0 ? (
          // Sliced glitch effect
          <>
            {Array.from({ length: sliceCount }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 overflow-hidden"
                style={{
                  top: `${i * sliceHeight}%`,
                  height: `${sliceHeight + 0.5}%`,
                  transform: `translateX(${slices[i] || 0}px)`,
                }}
              >
                <img
                  src={images[(current + (i % 2 === 0 ? 0 : 1)) % images.length]}
                  alt=""
                  className="absolute w-full h-full object-cover"
                  style={{
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    clipPath: `inset(${i * sliceHeight}% 0 ${100 - (i + 1) * sliceHeight}% 0)`,
                  }}
                />
              </div>
            ))}
          </>
        ) : (
          <img
            src={images[current]}
            alt=""
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        )}

        {/* RGB shift layers */}
        {(glitching || flicker) && (
          <>
            <div
              className="absolute inset-0 mix-blend-multiply opacity-70"
              style={{
                backgroundImage: `url(${images[current]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translateX(${glitching ? 4 : 1}px)`,
                filter: 'grayscale(100%) brightness(1.5)',
                backgroundColor: 'hsl(322 80% 55% / 0.4)',
              }}
            />
            <div
              className="absolute inset-0 mix-blend-screen opacity-40"
              style={{
                backgroundImage: `url(${images[(current + 1) % images.length]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translateX(${glitching ? -6 : -2}px) translateY(${glitching ? 2 : 0}px)`,
                filter: 'hue-rotate(90deg)',
              }}
            />
          </>
        )}

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.3) 2px,
              rgba(0,0,0,0.3) 4px
            )`,
          }}
        />

        {/* Noise texture */}
        {glitching && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      {/* Content */}
      <div className="relative z-10 flex items-end min-h-[85vh] pb-20">
        <div className="container">
          <div className="max-w-2xl space-y-6">
            <h1
              className="font-display text-7xl md:text-9xl font-bold tracking-tighter"
              style={{
                textShadow: glitching
                  ? '3px 0 hsl(322 80% 55%), -3px 0 hsl(200 80% 55%)'
                  : flicker
                  ? '1px 0 hsl(322 80% 55% / 0.5), -1px 0 hsl(200 80% 55% / 0.5)'
                  : 'none',
              }}
            >
              <span className="text-gradient-fuchsia">SHABBLY</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-md leading-relaxed">
              Музыка, которая звучит в каждом баре города
            </p>
          </div>
        </div>
      </div>

      {/* Glitch bar accents */}
      {glitching && (
        <>
          <div
            className="absolute left-0 right-0 h-[2px] bg-primary/80"
            style={{ top: `${20 + Math.random() * 60}%` }}
          />
          <div
            className="absolute left-0 right-0 h-[1px] bg-[hsl(200_80%_55%/0.6)]"
            style={{ top: `${10 + Math.random() * 70}%` }}
          />
          <div
            className="absolute left-0 w-1/3 h-[3px] bg-primary/40"
            style={{ top: `${30 + Math.random() * 40}%` }}
          />
        </>
      )}
    </section>
  );
};

export default GlitchHero;
