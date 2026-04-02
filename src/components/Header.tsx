import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Главная" },
  { to: "/about", label: "Обо мне" },
  { to: "/music", label: "Музыка" },
  { to: "/events", label: "Афиша" },
  { to: "/gallery", label: "Галерея" },
  { to: "/merch", label: "Мерч" },
  { to: "/bars", label: "Бары" },
  { to: "/news", label: "Новости" },
];

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-2xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-wider text-primary">
          SHABBLY
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
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
        <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground">
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
        </nav>
      )}
    </header>
  );
};

export default Header;
