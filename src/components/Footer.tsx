import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 mt-20">
    <div className="container py-16">
      <div className="grid gap-12 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <p className="font-display text-2xl font-bold tracking-wider text-primary">
            SHABBLY <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Agency</span>
          </p>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Продюсерское агентство: подбор артистов и организация мероприятий под ключ.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="https://t.me/SV_Yagovkina" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all" title="Telegram @SV_Yagovkina">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="https://www.youtube.com/@shabbly" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all" title="YouTube">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Agency */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Агентство</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/services" className="hover:text-primary transition-colors">Услуги</Link>
            <Link to="/artists" className="hover:text-primary transition-colors">Артисты</Link>
            <Link to="/cases" className="hover:text-primary transition-colors">Проекты</Link>
            <Link to="/about" className="hover:text-primary transition-colors">Артистам</Link>
            <Link to="/contacts" className="hover:text-primary transition-colors">Контакты</Link>
          </div>
        </div>

        {/* Афиша / контент */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Афиша</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/events" className="hover:text-primary transition-colors">Ближайшие концерты</Link>
            <Link to="/bars-calendar" className="hover:text-primary transition-colors">Бары Москвы</Link>
            <Link to="/news" className="hover:text-primary transition-colors">Новости</Link>
          </div>
        </div>

        {/* Медиа */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Медиа</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/music" className="hover:text-primary transition-colors">Музыка</Link>
            <Link to="/gallery" className="hover:text-primary transition-colors">Галерея</Link>
            <Link to="/merch" className="hover:text-primary transition-colors">Мерч</Link>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SHABBLY Agency. Все права защищены.
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link to="/contacts" className="hover:text-primary transition-colors">Заявка на мероприятие</Link>
          <Link to="/about" className="hover:text-primary transition-colors">Артистам</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
