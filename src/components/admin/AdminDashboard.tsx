import { useState } from "react";
import { Link } from "react-router-dom";
import AdminReleases from "./AdminReleases";
import AdminEvents from "./AdminEvents";
import AdminNews from "./AdminNews";
import AdminTickets from "./AdminTickets";
import AdminFriendEvents from "./AdminFriendEvents";
import { LogOut, Music, Calendar, Newspaper, Ticket, Users } from "lucide-react";

const tabs = [
  { id: "releases", label: "Релизы", icon: Music },
  { id: "events", label: "Концерты", icon: Calendar },
  { id: "news", label: "Новости", icon: Newspaper },
  { id: "tickets", label: "Заявки", icon: Ticket },
  { id: "friends", label: "Друзья", icon: Users },
] as const;

type Tab = typeof tabs[number]["id"];

const AdminDashboard = ({ onSignOut }: { onSignOut: () => void }) => {
  const [tab, setTab] = useState<Tab>("releases");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-lg font-bold text-primary">SHABBLY</Link>
          <span className="text-xs text-muted-foreground">Админ</span>
        </div>
        <button onClick={onSignOut} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <LogOut size={14} /> Выйти
        </button>
      </header>
      <div className="flex">
        <nav className="w-48 border-r border-border bg-card min-h-[calc(100vh-49px)] p-3 space-y-1 hidden md:block">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="flex-1 p-6">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-1 mb-6 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === "releases" && <AdminReleases />}
          {tab === "events" && <AdminEvents />}
          {tab === "news" && <AdminNews />}
          {tab === "tickets" && <AdminTickets />}
          {tab === "friends" && <AdminFriendEvents />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
