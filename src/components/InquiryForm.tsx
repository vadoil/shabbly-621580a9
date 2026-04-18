import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100),
  contact: z.string().trim().min(3, "Укажите контакт").max(200),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  format: z.string().trim().max(100).optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  comment: z.string().trim().max(2000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const initial: FormData = {
  name: "",
  contact: "",
  company: "",
  city: "",
  format: "",
  event_date: "",
  budget: "",
  comment: "",
};

const InquiryForm = ({ artistId }: { artistId?: string }) => {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const map: any = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) map[i.path[0] as string] = i.message;
      });
      setErrors(map);
      toast.error("Проверьте поля формы");
      return;
    }
    setLoading(true);
    const payload = {
      name: parsed.data.name,
      contact: parsed.data.contact,
      company: parsed.data.company || null,
      city: parsed.data.city || null,
      format: parsed.data.format || null,
      event_date: parsed.data.event_date || null,
      budget: parsed.data.budget || null,
      comment: parsed.data.comment || null,
      artist_id: artistId || null,
    };
    const { error } = await supabase.from("event_inquiries").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Не удалось отправить заявку");
      return;
    }
    toast.success("Заявка отправлена! Свяжемся с вами в течение 24 часов.");
    setForm(initial);
  };

  const field = "rounded-md border border-input bg-secondary/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Имя *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full ${field}`} placeholder="Ваше имя" maxLength={100} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Контакт *</label>
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className={`w-full ${field}`} placeholder="Телефон, email или Telegram" maxLength={200} />
          {errors.contact && <p className="text-xs text-destructive">{errors.contact}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Компания</label>
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={`w-full ${field}`} placeholder="Название компании" maxLength={150} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Город</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={`w-full ${field}`} placeholder="Москва" maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Формат</label>
          <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className={`w-full ${field}`}>
            <option value="">Выберите формат</option>
            <option value="Корпоратив">Корпоратив</option>
            <option value="Свадьба">Свадьба</option>
            <option value="Частное мероприятие">Частное мероприятие</option>
            <option value="Фестиваль">Фестиваль</option>
            <option value="Презентация бренда">Презентация бренда</option>
            <option value="Другое">Другое</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Дата мероприятия</label>
          <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={`w-full ${field}`} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Бюджет</label>
          <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={`w-full ${field}`}>
            <option value="">Не определён</option>
            <option value="до 300 000 ₽">до 300 000 ₽</option>
            <option value="300–700 000 ₽">300–700 000 ₽</option>
            <option value="700 000 – 1.5 млн ₽">700 000 – 1.5 млн ₽</option>
            <option value="от 1.5 млн ₽">от 1.5 млн ₽</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Комментарий</label>
        <textarea
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          rows={4}
          maxLength={2000}
          className={`w-full ${field} resize-none`}
          placeholder="Опишите задачу, площадку, ожидания…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all disabled:opacity-50"
      >
        {loading ? "Отправка…" : "Отправить заявку"} <Send size={14} />
      </button>
      <p className="text-[11px] text-muted-foreground">
        Отправляя форму, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  );
};

export default InquiryForm;
