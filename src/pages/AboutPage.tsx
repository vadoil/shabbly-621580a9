import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import ArtistApplicationForm from "@/components/ArtistApplicationForm";
import { Mic2, Calendar, TrendingUp, Megaphone, ShieldCheck, FileMusic, Headphones, Check, X, Sparkles, Flame } from "lucide-react";
import desireStudio from "@/assets/desire-studio.jpg";
import desireBackstage from "@/assets/desire-backstage.jpg";

const benefits = [
  { icon: Calendar, title: "Регулярные выступления", text: "Включаем артистов в афишу мероприятий: корпоративы, частные вечера, фестивали, площадки-партнёры." },
  { icon: TrendingUp, title: "Развитие карьеры", text: "Стратегия гастролей, выпуска песен и позиционирования. Помогаем расти от клубных сцен до больших залов." },
  { icon: Megaphone, title: "Продвижение и PR", text: "Контентные съёмки, работа с медиа, размещение на стримингах, коллаборации с брендами." },
  { icon: ShieldCheck, title: "Юр. поддержка и безопасность", text: "Договоры, отчётность, гонорары через юр. лицо. Защищаем интересы артиста на каждом этапе." },
  { icon: FileMusic, title: "Запись и выпуск песен", text: "Студия, аранжировки, сведение, мастеринг, размещение на Яндекс Музыке, Apple Music, Spotify, YouTube." },
  { icon: Headphones, title: "Технический райдер", text: "Решаем вопросы со звуком, светом и сценой на любых площадках — артист просто выходит и поёт." },
];

const looking = [
  "У вас уже есть готовая концертная программа на 40+ минут",
  "Есть записи студийного качества (демо или релизы на стримингах)",
  "Вы регулярно выступаете и готовы к гастрольному графику",
  "Работаете в живом составе или с минусами высокого качества",
  "Ответственно относитесь к договорённостям и срокам",
  "Готовы к долгосрочному сотрудничеству и развитию",
];

const notLooking = [
  "Полные новички без опыта живых выступлений",
  "Кавер-проекты без авторской программы (за редкими исключениями)",
  "Артисты, ищущие разовое продюсирование одного релиза",
  "Проекты с агрессивной или провокационной риторикой",
];

const formats = [
  { title: "Подбор выступлений", text: "Только организация выступлений: ищем площадки и события под ваш формат. Процент с гонорара.", best: "Артистам со своим менеджером и продюсером" },
  { title: "Сопровождение карьеры", text: "Полное ведение: гастроли, выпуск песен, бренд, продвижение. Эксклюзивный договор.", best: "Артистам, готовым к системному росту" },
  { title: "Сотрудничество с лейблом", text: "Выпуск песен и продвижение под нашей дистрибуцией. Без эксклюзива на выступления.", best: "Артистам с готовым материалом" },
];

const steps = [
  { n: "01", title: "Заявка", text: "Заполняете форму ниже: материалы, опыт, ожидания." },
  { n: "02", title: "Слушаем", text: "Команда оценивает уровень и потенциал в течение 3–5 дней." },
  { n: "03", title: "Знакомство", text: "Если подходите — приглашаем на встречу или созвон." },
  { n: "04", title: "Договор", text: "Фиксируем условия и формат сотрудничества." },
];

const faq = [
  { q: "Можно ли работать без эксклюзива?", a: "Да. Формат «Подбор выступлений» не требует эксклюзивного договора — мы просто берём процент с организованных нами концертов." },
  { q: "Сколько стоит сотрудничество?", a: "Артист ничего не платит на старте. Наша оплата — процент от гонораров за выступления или доходов с релизов. Конкретные условия фиксируем в договоре." },
  { q: "Что если у меня нет студийных записей?", a: "Минимум — качественное демо (можно с репетиции). Без записей оценить уровень невозможно. Если материал перспективный — поможем с записью." },
  { q: "В каких городах вы работаете?", a: "База — Москва и Санкт-Петербург. Регулярно организуем выступления в Сочи, Казани, Екатеринбурге, Краснодаре. Готовы работать с региональными артистами." },
  { q: "Как быстро будут выступления?", a: "Зависит от уровня и формата. Реальная воронка — 1–3 месяца от подписания договора до первого организованного нами выступления." },
  { q: "Что если вы откажете?", a: "Мы напишем причину. Можно вернуться через 6–12 месяцев с обновлённой программой — повторно рассмотрим." },
];

const AboutPage = () => {
  return (
    <Layout>
      <SEO
        title="Артистам — сотрудничество с агентством SHABBLY"
        description="Продюсерское агентство SHABBLY ищет артистов для долгосрочного сотрудничества: подбор выступлений, сопровождение карьеры, выпуск песен. Подайте заявку онлайн."
        canonical="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SHABBLY Agency",
          description: "Продюсерское агентство полного цикла",
          url: "https://shabbly.ru",
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,hsl(322_80%_55%/0.12)_0%,transparent_60%)]" />
        <div className="container relative z-10 pt-24 pb-20 max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-6 animate-fade-in">Артистам</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] animate-fade-in">
            Ищем артистов <br />
            для <span className="text-gradient-fuchsia">долгосрочного сотрудничества</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-8 leading-relaxed animate-fade-in">
            SHABBLY Agency — продюсерское агентство полного цикла. Подбираем выступления, сопровождаем карьеру,
            выпускаем песни и продвигаем артистов. Если вы делаете качественную музыку и готовы расти системно — давайте знакомиться.
          </p>
          <div className="flex flex-wrap gap-3 mt-10 animate-fade-in">
            <a href="#apply" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all">
              Подать заявку
            </a>
            <a href="#criteria" className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
              Кого мы ищем
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { v: "120+", l: "мероприятий в год" },
            { v: "50+", l: "артистов в составе" },
            { v: "8", l: "лет на рынке" },
            { v: "3-5 дн.", l: "ответ на заявку" },
          ].map((s) => (
            <div key={s.l} className="text-center p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-all">
              <p className="font-display text-3xl md:text-5xl font-bold text-gradient-fuchsia">{s.v}</p>
              <p className="text-[11px] md:text-xs text-muted-foreground mt-2 uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Desire split: studio */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
            <img
              src={desireStudio}
              alt="Запись в профессиональной студии"
              loading="lazy"
              width={1080}
              height={1350}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
              <FileMusic size={14} className="text-primary" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">Песня, ради которой вы пришли в музыку</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tighter">
              Студия, в которой <br />
              <span className="text-gradient-fuchsia">рождается ваш звук</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Тёплая лампа, дорогие микрофоны, продюсер, который слышит то, что вы ещё не успели сформулировать. Не «запись минуса под голос», а превращение демо в трек, который не стыдно поставить рядом с любимыми артистами.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Аранжировки, сведение, мастеринг, выпуск на всех площадках — под нашей дистрибуцией.
            </p>
          </div>
        </div>
      </section>

      {/* Desire split: stage */}
      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 lg:order-1 order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
              <Flame size={14} className="text-primary" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">Большая сцена</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tighter">
              Тот самый выход <br />
              <span className="text-gradient-fuchsia">из-за кулис в свет</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Когда охрана расступается, гул толпы прорывается сквозь дверь, и через 30 секунд вы — на сцене перед залом, который пришёл именно к вам. Не «выступить на дне города» — а собрать своих людей.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Мы строим путь от первого клуба до концертных залов и фестивалей. Системно, без иллюзий, с понятными шагами.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border lg:order-2 order-1">
            <img
              src={desireBackstage}
              alt="Артист выходит из бэкстейджа на сцену"
              loading="lazy"
              width={1600}
              height={1000}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Criteria */}
      <section id="criteria" className="container py-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Кого ищем</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">Критерии отбора</h2>
            <p className="text-muted-foreground mt-4">Мы выборочно подходим к составу. Это честно по отношению к тем артистам, с которыми уже работаем.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Check size={20} />
                <h3 className="font-display text-xl font-bold">Подходите, если</h3>
              </div>
              <ul className="space-y-3">
                {looking.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm leading-relaxed">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card/50 p-8 space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <X size={20} />
                <h3 className="font-display text-xl font-bold">Скорее всего откажем</h3>
              </div>
              <ul className="space-y-3">
                {notLooking.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <X size={16} className="shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
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
            <div key={v.title} className="bg-card p-8 space-y-4 hover:bg-card/60 transition-colors">
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
            <div key={f.title} className="rounded-2xl border border-border bg-card p-8 space-y-4 hover:border-primary/40 transition-colors">
              <Mic2 className="text-primary" size={24} />
              <h3 className="font-display text-2xl font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              <div className="pt-3 border-t border-border">
                <p className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1">Кому подходит</p>
                <p className="text-xs text-muted-foreground">{f.best}</p>
              </div>
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

      {/* FAQ */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Вопросы и ответы</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">FAQ</h2>
          </div>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-card overflow-hidden">
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-card/60 transition-colors">
                  <span className="font-medium">{item.q}</span>
                  <span className="text-primary transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="apply" className="container py-20 scroll-mt-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <Sparkles className="text-primary mx-auto" size={32} />
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Заявка артиста</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tighter">
              Заполните анкету
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Чем подробнее ответы — тем точнее мы оценим, подходим ли друг другу. Ответим в течение 3–5 рабочих дней.
            </p>
          </div>
          <ArtistApplicationForm />
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
