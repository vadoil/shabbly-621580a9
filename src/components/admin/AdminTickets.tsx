import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDateTime } from "@/lib/format";

const AdminTickets = () => {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin_tickets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ticket_requests").select("*, events(title)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Заявки на билеты</h2>
      {isLoading ? <p className="text-muted-foreground">Загрузка...</p> : tickets && tickets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4">Дата</th>
                <th className="py-2 pr-4">Имя</th>
                <th className="py-2 pr-4">Контакт</th>
                <th className="py-2 pr-4">Кол-во</th>
                <th className="py-2 pr-4">Событие</th>
                <th className="py-2 pr-4">Статус</th>
                <th className="py-2">Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-xs text-muted-foreground">{t.created_at && formatDateTime(t.created_at)}</td>
                  <td className="py-2 pr-4">{t.name}</td>
                  <td className="py-2 pr-4">{t.contact}</td>
                  <td className="py-2 pr-4">{t.qty}</td>
                  <td className="py-2 pr-4 text-xs">{(t as any).events?.title || "—"}</td>
                  <td className="py-2 pr-4">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${t.status === "new" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2 text-xs text-muted-foreground">{t.comment || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground">Заявок пока нет.</p>
      )}
    </div>
  );
};

export default AdminTickets;
