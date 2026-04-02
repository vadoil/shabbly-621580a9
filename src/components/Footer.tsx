import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12 mt-20">
    <div className="container text-center space-y-4">
      <p className="font-display text-lg font-bold tracking-wider text-primary">SHABBLY</p>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} SHABBLY. Все права защищены.
      </p>
      <div className="flex justify-center gap-6 text-sm text-muted-foreground">
        <Link to="/music" className="hover:text-primary transition-colors">Музыка</Link>
        <Link to="/events" className="hover:text-primary transition-colors">Афиша</Link>
        <Link to="/news" className="hover:text-primary transition-colors">Новости</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
