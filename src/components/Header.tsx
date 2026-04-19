import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Главная" },
  { to: "/services", label: "Услуги" },
  { to: "/artists", label: "Артисты" },
  { to: "/music", label: "Музыка" },
  { to: "/events", label: "Афиша" },
  { to: "/cases", label: "Проекты" },
  { to: "/gallery", label: "Галерея" },
  { to: "/news", label: "Новости" },
  { to: "/about", label: "Артистам" },
  { to: "/contacts", label: "Контакты" },
];

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-2xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-bold tracking-wider text-primary shrink-0">
          SHABBLY
          <span className="ml-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Agency</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/contacts"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] transition-all"
          >
            Заявка на мероприятие
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground" aria-label="Меню">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block text-sm font-medium ${pathname === l.to ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contacts"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Заявка на мероприятие
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
