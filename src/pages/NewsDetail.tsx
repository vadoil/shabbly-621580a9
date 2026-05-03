import Layout from "@/components/Layout";
import { useNewsBySlug } from "@/hooks/use-data";
import { useParams, Link } from "react-router-dom";
import { formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useNewsBySlug(slug || "");

  if (isLoading) return <Layout><div className="container py-16"><div className="animate-pulse h-64 bg-secondary rounded-lg" /></div></Layout>;
  if (!article) return <Layout><div className="container py-16"><p className="text-muted-foreground">Статья не найдена.</p></div></Layout>;

  return (
    <Layout>
      <article className="container py-16 max-w-3xl mx-auto space-y-6">
        <Link to="/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Все новости
        </Link>
        {article.cover_url && (
          <div className="rounded-lg overflow-hidden bg-secondary">
            {/\.(mp4|webm|mov|m4v)(\?|$)/i.test(article.cover_url) ? (
              <video src={article.cover_url} controls playsInline preload="metadata" className="w-full h-auto max-h-[80vh] bg-black" />
            ) : (
              <div className="aspect-video">
                <img src={article.cover_url} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{article.published_at && formatDate(article.published_at)}</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold">{article.title}</h1>
        <div className="prose prose-invert prose-sm max-w-none text-secondary-foreground leading-relaxed space-y-4">
          {article.content.split(/\n/).map((line, i) => {
            const trimmed = line.trim();
            if (/^https?:\/\/\S+\.(mp4|webm|mov|m4v)(\?|$)/i.test(trimmed)) {
              return <video key={i} src={trimmed} controls playsInline preload="metadata" className="w-full rounded-lg bg-black max-h-[70vh]" />;
            }
            if (/^https?:\/\/\S+\.(jpe?g|png|webp|gif)(\?|$)/i.test(trimmed)) {
              return <img key={i} src={trimmed} alt="" className="w-full rounded-lg" />;
            }
            return <p key={i} className="whitespace-pre-line">{line}</p>;
          })}
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetail;
