import { Link } from "react-router-dom";
import { useServices } from "@/hooks/use-agency-data";
import { ArrowRight, Music2, Mic2, Briefcase, PartyPopper, Sparkles } from "lucide-react";

const iconMap: Record<string, any> = {
  music: Music2,
  mic: Mic2,
  briefcase: Briefcase,
  party: PartyPopper,
  sparkles: Sparkles,
};

const AgencyServicesPreview = () => {
  const { data: services } = useServices();
  const items = services?.slice(0, 4) || [];

  return (
    <section className="container py-24 space-y-12">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div className="space-y-3 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Что мы делаем</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
            Услуги для организаторов
          </h2>
          <p className="text-muted-foreground">
            От подбора артиста до полного продакшна мероприятия — закрываем под ключ.
          </p>
        </div>
        <Link to="/services" className="text-sm text-primary hover:underline flex items-center gap-1">
          Все услуги <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-border">
        {items.map((s) => {
          const Icon = iconMap[s.icon || ""] || Sparkles;
          return (
            <div
              key={s.id}
              className="group relative bg-card p-8 hover:bg-card/60 transition-colors flex flex-col gap-5 min-h-[260px]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon size={22} />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                {s.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                )}
              </div>
              <Link
                to="/services"
                className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Подробнее <ArrowRight size={12} />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AgencyServicesPreview;
