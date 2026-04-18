import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Sparkles, ShieldCheck, Heart } from "lucide-react";

const values = [
  {
    icon: Compass,
    title: "Кураторский подход",
    text: "Не отдаём всё подряд — каждый артист подбирается под аудиторию, площадку и эмоцию вашего мероприятия.",
  },
  {
    icon: Sparkles,
    title: "Премиальный продакшн",
    text: "Свет, звук, сценография — закрываем все технические аспекты, чтобы артист звучал максимально мощно.",
  },
  {
    icon: ShieldCheck,
    title: "Договорная прозрачность",
    text: "Чёткие контракты, фиксированные сметы, гарантии — работаем по официальной отчётности с юр. лицами.",
  },
  {
    icon: Heart,
    title: "Долгосрочные отношения",
    text: "70% клиентов возвращаются. Мы строим репутацию через каждое отдельное событие.",
  },
];

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,hsl(322_80%_55%/0.1)_0%,transparent_60%)]" />
        <div className="container relative z-10 pt-24 pb-20 max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-6">Об агентстве</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
            Превращаем музыку <br />
            в <span className="text-gradient-fuchsia">бизнес-результат</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-8 leading-relaxed">
            SHABBLY Agency — продюсерское агентство полного цикла. Мы подбираем артистов,
            продюсируем live-программы и закрываем мероприятия под ключ для брендов,
            event-агентств и частных клиентов.
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Манифест</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter">
              Музыка — это не фон. Это драматургия события.
            </h2>
          </div>
          <div className="space-y-4 text-secondary-foreground leading-relaxed">
            <p>
              Мы не «поставляем артистов». Мы выстраиваем эмоциональный сценарий вашего вечера —
              от первого аккорда фоновой программы до финального хита, под который гости
              хочется задержаться ещё на час.
            </p>
            <p>
              За плечами — сотни мероприятий: от закрытых ужинов в ресторанах до корпоративных
              фестивалей на тысячи человек. И флагманский артист агентства — SHABBLY.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container py-20 space-y-12">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Принципы</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">Как мы работаем</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {values.map((v) => (
            <div key={v.title} className="bg-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <v.icon size={22} />
              </div>
              <h3 className="font-display text-xl font-bold">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container py-20">
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { v: "120+", l: "мероприятий в год" },
            { v: "50+", l: "артистов в ростере" },
            { v: "8", l: "лет на рынке" },
            { v: "70%", l: "клиентов возвращаются" },
          ].map((s) => (
            <div key={s.l} className="text-center p-8 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-all">
              <p className="font-display text-4xl md:text-5xl font-bold text-gradient-fuchsia">{s.v}</p>
              <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-12 text-center space-y-6 glow-fuchsia">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter">
            Готовы обсудить ваше мероприятие?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Оставьте заявку — пришлём подборку артистов и сметы под ваш формат в течение 24 часов.
          </p>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all"
          >
            Оставить заявку <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
