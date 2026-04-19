import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useState } from "react";

const STATUSES = [
  { v: "new", l: "Новая" },
  { v: "review", l: "Слушаем" },
  { v: "interview", l: "Знакомство" },
  { v: "accepted", l: "Приняли" },
  { v: "rejected", l: "Отказ" },
];

const AdminArtistApplications = () => {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin_artist_applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("artist_applications").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin_artist_applications"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить заявку артиста?")) return;
    await supabase.from("artist_applications").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_artist_applications"] });
  };

  const renderLinks = (links: unknown, title: string) => {
    const arr = Array.isArray(links) ? (links as string[]) : [];
    if (arr.length === 0) return null;
    return (
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
        <ul className="space-y-1">
          {arr.map((u, i) => (
            <li key={i}>
              <a href={u} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 break-all">
                <ExternalLink size={11} className="shrink-0" /> {u}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Заявки артистов</h2>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Загрузка…</div>
      ) : items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((i: any) => {
            const isOpen = expanded === i.id;
            return (
              <div key={i.id} className="rounded-lg border border-border bg-card">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{i.name}</h3>
                        {i.project_name && <span className="text-xs text-muted-foreground">· {i.project_name}</span>}
                      </div>
                      <p className="text-sm text-foreground break-all">{i.contact}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(i.created_at)} {i.city && `· ${i.city}`}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={i.status}
                        onChange={(e) => updateStatus(i.id, e.target.value)}
                        className="rounded-md border border-input bg-secondary px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                      </select>
                      <button onClick={() => setExpanded(isOpen ? null : i.id)} className="text-muted-foreground hover:text-foreground p-1">
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(i.genres || []).map((g: string) => (
                      <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{g}</span>
                    ))}
                    {(i.cities || []).map((c: string) => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{c}</span>
                    ))}
                  </div>
                  {isOpen && (
                    <div className="grid md:grid-cols-3 gap-4 border-t border-border pt-4">
                      {renderLinks(i.music_links, "Музыка")}
                      {renderLinks(i.social_links, "Соцсети")}
                      {renderLinks(i.video_links, "Видео")}
                      {i.about && <div className="md:col-span-3"><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">О проекте</p><p className="text-sm whitespace-pre-line">{i.about}</p></div>}
                      {i.experience && <div className="md:col-span-3"><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Опыт</p><p className="text-sm whitespace-pre-line">{i.experience}</p></div>}
                      {i.expectations && <div className="md:col-span-3"><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ожидания</p><p className="text-sm whitespace-pre-line">{i.expectations}</p></div>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground p-6 rounded-lg border border-border bg-card">Заявок артистов пока нет</div>
      )}
    </div>
  );
};

export default AdminArtistApplications;
