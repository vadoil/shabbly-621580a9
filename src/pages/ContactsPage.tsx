import Layout from "@/components/Layout";
import InquiryForm from "@/components/InquiryForm";
import { Phone, Send, Music, MapPin, Clock } from "lucide-react";

const ContactsPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,hsl(322_80%_55%/0.12)_0%,transparent_60%)]" />
        <div className="container relative z-10 pt-24 pb-12 max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-6">Контакты</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
            Заявка на <span className="text-gradient-fuchsia">мероприятие</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-8 max-w-2xl leading-relaxed">
            Расскажите о вашем событии — пришлём подборку артистов и смету в течение 24 часов.
          </p>
        </div>
      </section>

      {/* Form + contacts */}
      <section className="container pb-24">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10 max-w-6xl mx-auto">
          {/* Form */}
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold mb-6">Расскажите о проекте</h2>
            <InquiryForm />
          </div>

          {/* Contacts side */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
              <h3 className="font-display text-lg font-bold">Свяжитесь напрямую</h3>
              <div className="space-y-4">
                <a href="mailto:hello@shabbly.ru" className="flex items-start gap-3 group">
                  <Mail size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="text-sm group-hover:text-primary transition-colors">hello@shabbly.ru</p>
                  </div>
                </a>
                <a href="tel:+74951234567" className="flex items-start gap-3 group">
                  <Phone size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Телефон</p>
                    <p className="text-sm group-hover:text-primary transition-colors">+7 (495) 123-45-67</p>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Офис</p>
                    <p className="text-sm">Москва, по предварительной записи</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Часы работы</p>
                    <p className="text-sm">Пн–Пт, 10:00 – 20:00 МСК</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 space-y-3">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">Срочный запрос?</p>
              <p className="text-sm text-foreground leading-relaxed">
                Если событие в ближайшие 7 дней — отметьте это в комментарии или позвоните напрямую,
                подключим менеджера в приоритете.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactsPage;
