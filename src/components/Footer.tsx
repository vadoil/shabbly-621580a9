import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 mt-20">
    <div className="container py-16">
      <div className="grid gap-12 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <p className="font-display text-2xl font-bold tracking-wider text-primary">SHABBLY</p>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Музыка, которая звучит в каждом баре города. Официальный сайт артиста.
          </p>
        </div>

        {/* Nav */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Навигация</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/music" className="hover:text-primary transition-colors">Музыка</Link>
            <Link to="/events" className="hover:text-primary transition-colors">Афиша</Link>
            <Link to="/gallery" className="hover:text-primary transition-colors">Галерея</Link>
            <Link to="/merch" className="hover:text-primary transition-colors">Мерч</Link>
            <Link to="/news" className="hover:text-primary transition-colors">Новости</Link>
          </div>
        </div>

        {/* Streaming */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Стриминг</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Яндекс Музыка</a>
            <a href="#" className="hover:text-primary transition-colors">Spotify</a>
            <a href="#" className="hover:text-primary transition-colors">Apple Music</a>
            <a href="#" className="hover:text-primary transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SHABBLY. Все права защищены.
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link to="/about" className="hover:text-primary transition-colors">Обо мне</Link>
          <Link to="/bars-calendar" className="hover:text-primary transition-colors">Бары Москвы</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
