import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Plus, X, Check, Loader2 } from "lucide-react";

const GENRES = ["Поп", "Соул", "R&B", "Джаз", "Рок", "Электроника", "Хип-хоп", "Кавер", "Авторская песня", "Этно"];
const CITIES = ["Москва", "Санкт-Петербург", "Сочи", "Казань", "Екатеринбург", "Краснодар", "Регионы РФ", "СНГ"];

const linkSchema = z.string().trim().url({ message: "Некорректная ссылка" }).max(500);

const formSchema = z.object({
  name: z.string().trim().min(2, "Минимум 2 символа").max(100),
  project_name: z.string().trim().max(100).optional().or(z.literal("")),
  contact: z.string().trim().min(5, "Укажите телефон, email или Telegram").max(200),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  genres: z.array(z.string()).min(1, "Выберите хотя бы один жанр"),
  cities: z.array(z.string()),
  music_links: z.array(linkSchema).min(1, "Добавьте хотя бы одну ссылку на музыку"),
  social_links: z.array(linkSchema),
  video_links: z.array(linkSchema),
  experience: z.string().trim().max(2000).optional().or(z.literal("")),
  about: z.string().trim().max(2000).optional().or(z.literal("")),
  expectations: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const ArtistApplicationForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<FormData>({
    name: "",
    project_name: "",
    contact: "",
    city: "",
    genres: [],
    cities: [],
    music_links: [""],
    social_links: [""],
    video_links: [""],
    experience: "",
    about: "",
    expectations: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggle = (field: "genres" | "cities", value: string) => {
    setData((d) => ({
      ...d,
      [field]: d[field].includes(value) ? d[field].filter((v) => v !== value) : [...d[field], value],
    }));
  };

  const updateLink = (field: "music_links" | "social_links" | "video_links", i: number, val: string) => {
    setData((d) => ({ ...d, [field]: d[field].map((v, idx) => (idx === i ? val : v)) }));
  };
  const addLink = (field: "music_links" | "social_links" | "video_links") => {
    setData((d) => ({ ...d, [field]: [...d[field], ""] }));
  };
  const removeLink = (field: "music_links" | "social_links" | "video_links", i: number) => {
    setData((d) => ({ ...d, [field]: d[field].filter((_, idx) => idx !== i) }));
  };

  const next = () => {
    // step-specific minimal validation before moving forward
    if (step === 1 && (!data.name.trim() || !data.contact.trim())) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    if (step === 2 && data.genres.length === 0) {
      toast({ title: "Выберите хотя бы один жанр", variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    // strip empty links before validation
    const cleaned = {
      ...data,
      music_links: data.music_links.filter((l) => l.trim()),
      social_links: data.social_links.filter((l) => l.trim()),
      video_links: data.video_links.filter((l) => l.trim()),
    };
    const result = formSchema.safeParse(cleaned);
    if (!result.success) {
      toast({ title: "Проверьте форму", description: result.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("artist_applications").insert({
      name: cleaned.name,
      project_name: cleaned.project_name || null,
      contact: cleaned.contact,
      city: cleaned.city || null,
      genres: cleaned.genres,
      cities: cleaned.cities,
      music_links: cleaned.music_links,
      social_links: cleaned.social_links,
      video_links: cleaned.video_links,
      experience: cleaned.experience || null,
      about: cleaned.about || null,
      expectations: cleaned.expectations || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Ошибка отправки", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-12 text-center space-y-4 glow-fuchsia animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
          <Check className="text-primary" size={32} />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold">Заявка отправлена</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Мы внимательно слушаем каждую заявку. Ответим в течение 3–5 рабочих дней. Если ваш материал подходит — пригласим на знакомство.
        </p>
      </div>
    );
  }

  const inputCls = "w-full rounded-lg border border-input bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
  const labelCls = "block text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-10 space-y-8">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-wider">Шаг {step} из {totalSteps}</span>
          <span className="text-primary font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step 1: Контакты */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <h3 className="font-display text-2xl font-bold">Знакомство</h3>
          <div>
            <label className={labelCls}>Имя или сценический псевдоним *</label>
            <input className={inputCls} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} maxLength={100} placeholder="Анна Петрова / SHABBLY" />
          </div>
          <div>
            <label className={labelCls}>Название проекта / группы</label>
            <input className={inputCls} value={data.project_name} onChange={(e) => setData({ ...data, project_name: e.target.value })} maxLength={100} placeholder="Если есть отдельное название" />
          </div>
          <div>
            <label className={labelCls}>Как с вами связаться: телефон, email или Telegram *</label>
            <input className={inputCls} value={data.contact} onChange={(e) => setData({ ...data, contact: e.target.value })} maxLength={200} placeholder="+7 999 000 00 00 или @username" />
          </div>
          <div>
            <label className={labelCls}>Город базирования</label>
            <input className={inputCls} value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} maxLength={100} placeholder="Москва" />
          </div>
        </div>
      )}

      {/* Step 2: Жанры и география */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="font-display text-2xl font-bold">Жанры и география выступлений</h3>
          <div>
            <label className={labelCls}>Жанры * (можно несколько)</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggle("genres", g)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                    data.genres.includes(g)
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                      : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Где готовы выступать</label>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggle("cities", c)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                    data.cities.includes(c)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Материалы */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="font-display text-2xl font-bold">Материалы</h3>
          <p className="text-sm text-muted-foreground -mt-3">
            Добавьте ссылки — без материалов мы не сможем оценить уровень.
          </p>

          {(["music_links", "social_links", "video_links"] as const).map((field) => {
            const titles = {
              music_links: "Музыка * (Яндекс, Spotify, Apple Music, SoundCloud)",
              social_links: "Соцсети (Instagram, ВКонтакте, Telegram-канал)",
              video_links: "Видео выступлений (YouTube, Rutube, Vimeo)",
            };
            return (
              <div key={field}>
                <label className={labelCls}>{titles[field]}</label>
                <div className="space-y-2">
                  {data[field].map((link, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className={inputCls}
                        value={link}
                        onChange={(e) => updateLink(field, i, e.target.value)}
                        placeholder="https://"
                        maxLength={500}
                      />
                      {data[field].length > 1 && (
                        <button type="button" onClick={() => removeLink(field, i)} className="shrink-0 w-12 rounded-lg border border-border hover:border-destructive hover:text-destructive transition-colors flex items-center justify-center">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addLink(field)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <Plus size={14} /> Добавить ссылку
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 4: О себе */}
      {step === 4 && (
        <div className="space-y-5 animate-fade-in">
          <h3 className="font-display text-2xl font-bold">О себе и ожиданиях</h3>
          <div>
            <label className={labelCls}>Опыт выступлений</label>
            <textarea className={`${inputCls} min-h-24 resize-y`} value={data.experience} onChange={(e) => setData({ ...data, experience: e.target.value })} maxLength={2000} placeholder="Где, как часто, какие площадки и форматы" />
          </div>
          <div>
            <label className={labelCls}>Кратко о проекте</label>
            <textarea className={`${inputCls} min-h-24 resize-y`} value={data.about} onChange={(e) => setData({ ...data, about: e.target.value })} maxLength={2000} placeholder="Что вы делаете, чем отличаетесь, какая аудитория" />
          </div>
          <div>
            <label className={labelCls}>Что хотите получить от сотрудничества</label>
            <textarea className={`${inputCls} min-h-20 resize-y`} value={data.expectations} onChange={(e) => setData({ ...data, expectations: e.target.value })} maxLength={1000} placeholder="Подбор выступлений, сопровождение, выпуск песен — что приоритетнее" />
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={16} /> Назад
        </button>
        {step < totalSteps ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all"
          >
            Далее <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all disabled:opacity-50"
          >
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Отправка...</> : <>Отправить заявку <ArrowRight size={16} /></>}
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtistApplicationForm;
