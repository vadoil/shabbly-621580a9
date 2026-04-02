import Layout from "@/components/Layout";
import { useMerchProducts } from "@/hooks/use-data";
import { getPublicStorageUrl } from "@/lib/storage";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useState, useMemo } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

const MerchPage = () => {
  const { data: products, isLoading } = useMerchProducts();
  const [catFilter, setCatFilter] = useState("");

  const categories = useMemo(() => {
    const cats = [...new Set(products?.map((p) => p.category) || [])];
    return cats;
  }, [products]);

  const filtered = catFilter ? products?.filter((p) => p.category === catFilter) : products;

  const catLabels: Record<string, string> = {
    clothing: "Одежда",
    accessories: "Аксессуары",
    other: "Другое",
  };

  return (
    <Layout>
      <section className="container py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Мерч</h1>
          <p className="text-muted-foreground">Официальный мерч SHABBLY</p>
        </div>

        {categories.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCatFilter("")} className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${!catFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              Все
            </button>
            {categories.map((c) => (
              <button key={c} onClick={() => setCatFilter(c || "")} className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${catFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                {catLabels[c || "other"] || c}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton count={8} />
        ) : filtered && filtered.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <Link key={p.id} to={`/merch/${p.slug}`} className="group space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border group-hover:border-primary/40 group-hover:glow-fuchsia transition-all">
                  {p.cover_url ? (
                    <img src={getPublicStorageUrl(p.cover_url)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ShoppingBag size={48} /></div>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors">{p.title}</h3>
                  {p.price_text && <p className="text-sm text-primary font-medium mt-0.5">{p.price_text}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={ShoppingBag} title="Мерч скоро появится" description="Следите за обновлениями" />
        )}
      </section>
    </Layout>
  );
};

export default MerchPage;
