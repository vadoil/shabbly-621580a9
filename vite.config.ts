import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // В production-сборке (которая деплоится на shabbly.ru через VPS)
  // подменяем Supabase URL на собственный nginx-прокси api.shabbly.ru,
  // чтобы обойти блокировку Supabase в России.
  // В dev / Lovable preview оставляем оригинальный URL из .env.
  const define =
    mode === "production"
      ? {
          "import.meta.env.VITE_SUPABASE_URL": JSON.stringify("https://api.shabbly.ru"),
        }
      : {};

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    define,
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
