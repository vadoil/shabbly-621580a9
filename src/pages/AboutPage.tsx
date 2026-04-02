import Layout from "@/components/Layout";
import { useSiteSections, useTeamMembers, usePartners, usePublishedGalleryItems } from "@/hooks/use-data";
import { getPublicStorageUrl } from "@/lib/storage";
import { Link } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import { Music, Users, Award, Headphones, Image } from "lucide-react";

const AboutPage = () => {
  const { data: sections } = useSiteSections(["about_therapy", "about_band", "stats", "partners_text", "hero_tagline"]);
  const { data: team } = useTeamMembers();
  const { data: partners } = usePartners();
  const { data: photos } = usePublishedGalleryItems(6);

  const getSection = (key: string) => sections?.find((s) => s.key === key);
  const therapy = getSection("about_therapy");
  const band = getSection("about_band");
  const statsSection = getSection("stats");
  const partnersText = getSection("partners_text");

  const stats = statsSection?.content?.split("\n").map((line) => {
    const [value, label] = line.split("|");
    return { value: value?.trim(), label: label?.trim() };
  }).filter((s) => s.value && s.label) || [];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(322_80%_55%/0.06)_0%,transparent_70%)]" />
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-gradient-fuchsia">
            Обо мне
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {getSection("hero_tagline")?.content || "Музыка, которая звучит в каждом баре города"}
          </p>
        </div>
      </section>

      {/* Story / Therapy */}
      {therapy && (
        <section className="container py-20">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Headphones size={22} className="text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">{therapy.title}</h2>
            </div>
            <p className="text-secondary-foreground leading-relaxed text-lg whitespace-pre-line">{therapy.content}</p>
          </div>
        </section>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <section className="container py-16">
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-10 rounded-2xl border border-border bg-card/50 hover:border-primary/30 hover:glow-fuchsia transition-all">
                <p className="font-display text-5xl md:text-6xl font-bold text-gradient-fuchsia">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-3">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Team */}
      <section className="container py-20 space-y-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={22} className="text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">{band?.title || "Команда"}</h2>
          </div>
          {band?.content && <p className="text-secondary-foreground leading-relaxed text-lg mt-6">{band.content}</p>}
        </div>

        {team && team.length > 0 ? (
          <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto">
            {team.map((m) => (
              <div key={m.id} className="group text-center space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 group-hover:glow-fuchsia transition-all">
                  {m.photo_url ? (
                    <img src={getPublicStorageUrl(m.photo_url)} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Music size={48} /></div>
                  )}
                </div>
                <div>
                  <p className="font-display font-bold">{m.name}</p>
                  <p className="text-xs text-primary">{m.role}</p>
                  {m.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Users} title="Команда скоро появится" />
        )}
      </section>

      {/* Best photos */}
      {photos && photos.length > 0 && (
        <section className="container py-16 space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-bold">Лучшие фото</h2>
            <Link to="/gallery" className="text-sm text-primary hover:underline">Все фото →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((item) => (
              <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-secondary">
                <img src={getPublicStorageUrl(item.image_url)} alt={item.caption || ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Partners */}
      {partnersText && (
        <section className="container py-20">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award size={22} className="text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold">{partnersText.title}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">{partnersText.content}</p>
            {partners && partners.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 items-center">
                {partners.map((p) => (
                  <a key={p.id} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors h-20">
                    {p.logo_url ? (
                      <img src={getPublicStorageUrl(p.logo_url)} alt={p.name} className="max-h-10 max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">{p.name}</span>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState icon={Award} title="Партнёры скоро появятся" />
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AboutPage;
