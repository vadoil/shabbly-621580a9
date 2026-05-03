import Layout from "@/components/Layout";
import { useMerchProduct } from "@/hooks/use-data";
import { supabase } from "@/integrations/supabase/client";
import { getPublicStorageUrl } from "@/lib/storage";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const MerchDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useMerchProduct(slug || "");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.contact) return toast.error("Заполните имя и контакт");
    setSubmitting(true);
    const { error } = await supabase.from("merch_requests").insert({
      product_id: product?.id,
      name: form.name,
      contact: form.contact,
      comment: form.comment || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Заявка отправлена!");
    setShowForm(false);
    setForm({ name: "", contact: "", comment: "" });
  };

  if (isLoading) return <Layout><div className="container py-16"><LoadingSkeleton variant="hero" /></div></Layout>;
  if (!product) return (
    <Layout>
      <div className="container py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/20 mb-4" />
        <p className="text-muted-foreground">Товар не найден</p>
        <Link to="/merch" className="text-sm text-primary hover:underline mt-2 inline-block">← Весь мерч</Link>
      </div>
    </Layout>
  );

  const variants = (product as any).merch_variants || [];

  return (
    <Layout>
      <section className="container py-16">
        <Link to="/merch" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Весь мерч
        </Link>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary glow-fuchsia">
            {product.cover_url ? (
              <img src={getPublicStorageUrl(product.cover_url)} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag size={80} /></div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">{product.category === "clothing" ? "Одежда" : product.category === "accessories" ? "Аксессуары" : "Мерч"}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">{product.title}</h1>
              {product.price_text && <p className="text-2xl font-display font-bold text-primary mt-3">{product.price_text}</p>}
            </div>
            {product.description && <p className="text-secondary-foreground leading-relaxed">{product.description}</p>}

            {variants.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Варианты</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v: any) => (
                    <span key={v.id} className={`rounded-full border px-4 py-1.5 text-xs font-medium ${v.in_stock ? "border-border text-foreground" : "border-border/50 text-muted-foreground line-through"}`}>
                      {[v.size, v.color].filter(Boolean).join(" / ") || v.sku}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setShowForm(true)} className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_30px_hsl(322_80%_55%/0.4)] transition-all">
              Заказать
            </button>
          </div>
        </div>
      </section>

      {/* Request modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg font-bold">Заявка на «{product.title}»</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <input placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-input bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Телефон или Telegram" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full rounded-lg border border-input bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <textarea placeholder="Комментарий (размер, цвет, доставка...)" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={3} className="w-full rounded-lg border border-input bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            <button onClick={handleSubmit} disabled={submitting} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
              {submitting ? "Отправка..." : "Отправить заявку"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MerchDetail;
