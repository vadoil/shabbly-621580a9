import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Mic2, Calendar, TrendingUp, Megaphone, Users, ShieldCheck, FileMusic, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Calendar,
    title: "Регулярные выступления",
    text: "Включаем артистов в афишу мероприятий: корпоративы, частные вечера, фестивали, площадки-партнёры.",
  },
  {
    icon: TrendingUp,
    title: "Развитие карьеры",
    text: "Стратегия гастролей, релизов и позиционирования. Помогаем расти от клубных сцен до больших залов.",
  },
  {
    icon: Megaphone,
    title: "Продвижение и PR",
    text: "Контентные съёмки, работа с медиа, размещение на стримингах, коллаборации с брендами.",
  },
  {
    icon: ShieldCheck,
    title: "Юр. поддержка и безопасность",
    text: "Договоры, отчётность, гонорары через юр. лицо. Защищаем интересы артиста на каждом этапе.",
  },
  {
    icon: FileMusic,
    title: "Запись и выпуск песен",
    text: "Студия, аранжировки, сведение, мастеринг, размещение на Яндекс Музыке, Apple Music, Spotify, YouTube.",
  },
  {
    icon: Headphones,
    title: "Технический райдер",
    text: "Решаем вопросы со звуком, светом и сценой на любых площадках — артист просто выходит и поёт.",
  },
];

const steps = [
  { n: "01", title: "Заявка", text: "Присылаете демо, ссылки на стриминги и краткое описание." },
  { n: "02", title: "Знакомство", text: "Слушаем, смотрим выступления, обсуждаем цели и формат сотрудничества." },
  { n: "03", title: "Договор", text: "Фиксируем условия: подбор выступлений, сопровождение или полная постановка." },
  { n: "04", title: "Запуск", text: "Включаем в состав, ставим в афишу и начинаем продвигать." },
];

const formats = [
  { title: "Подбор выступлений", text: "Только организация выступлений: ищем площадки и события под ваш формат." },
  { title: "Сопровождение карьеры", text: "Полное ведение карьеры: гастроли, выпуск песен, бренд, продвижение." },
  { title: "Сотрудничество с лейблом", text: "Выпуск песен и продвижение под нашей дистрибуцией." },
];

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,hsl(322_80%_55%/0.12)_0%,transparent_60%)]" />
        <div className="container relative z-10 pt-24 pb-20 max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-6">Артистам</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
            Ищем артистов <br />
            для <span className="text-gradient-fuchsia">долгосрочного сотрудничества</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-8 leading-relaxed">
            SHABBLY Agency — продюсерское агентство полного цикла. Мы работаем с певцами, группами и
            музыкальными проектами: подбор выступлений, сопровождение карьеры, выпуск песен и продвижение. Если вы делаете
            качественную музыку и готовы расти — давайте знакомиться.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              to="/contacts?type=artist"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all"
            >
              Оставить заявку артиста <ArrowRight size={16} />
            </Link>
            <Link
              to="/artists"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
            >
              Наш состав
            </Link>
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">С кем работаем</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter">
              Сольные исполнители, группы, проекты любого жанра
            </h2>
          </div>
          <div className="space-y-4 text-secondary-foreground leading-relaxed">
            <p>
              Поп, соул, R&amp;B, джаз, рок, электронная музыка, кавер-программы — нам важна не стилистика,
              а уровень исполнения и готовность работать вдолгую.
            </p>
            <p>
              Берём в состав артистов, которые уже выступают на средних площадках и хотят системного
              развития: больше выступлений, лучше райдер, выше гонорар, шире аудитория.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-20 space-y-12">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Что вы получаете</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">Преимущества сотрудничества</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {benefits.map((v) => (
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

      {/* Formats */}
      <section className="container py-20 space-y-12">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Форматы</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">Три модели сотрудничества</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {formats.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-8 space-y-3 hover:border-primary/40 transition-colors">
              <Mic2 className="text-primary" size={24} />
              <h3 className="font-display text-2xl font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container py-20 space-y-12">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Как начать</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">4 шага до контракта</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="space-y-3">
              <p className="font-display text-5xl font-bold text-gradient-fuchsia">{s.n}</p>
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
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
            { v: "24ч", l: "ответ на заявку" },
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
          <Users className="text-primary mx-auto" size={36} />
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tighter">
            Готовы стать частью ростера?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Оставьте заявку с ссылками на ваши треки и соцсети — менеджер свяжется в течение 24 часов.
          </p>
          <Link
            to="/contacts?type=artist"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all"
          >
            Подать заявку <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
