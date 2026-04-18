import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useArtists = (opts?: { featured?: boolean; limit?: number }) =>
  useQuery({
    queryKey: ["artists_public", opts],
    queryFn: async () => {
      let q = supabase.from("artists").select("*").eq("published", true);
      if (opts?.featured) q = q.eq("featured", true);
      q = q.order("sort_order", { ascending: true }).order("popularity", { ascending: false });
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useArtistBySlug = (slug?: string) =>
  useQuery({
    queryKey: ["artist_public", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const useArtistMedia = (artistId?: string) =>
  useQuery({
    queryKey: ["artist_media_public", artistId],
    enabled: !!artistId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_media")
        .select("*")
        .eq("artist_id", artistId!)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useRelatedArtists = (artist?: { id: string; genres: string[] | null }) =>
  useQuery({
    queryKey: ["artists_related", artist?.id],
    enabled: !!artist?.id,
    queryFn: async () => {
      const genres = artist?.genres ?? [];
      let q = supabase.from("artists").select("*").eq("published", true).neq("id", artist!.id);
      if (genres.length > 0) q = q.overlaps("genres", genres);
      const { data, error } = await q
        .order("popularity", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

export const useServices = () =>
  useQuery({
    queryKey: ["services_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useCases = (opts?: { featured?: boolean; limit?: number }) =>
  useQuery({
    queryKey: ["cases_public", opts],
    queryFn: async () => {
      let q = supabase.from("cases").select("*").eq("published", true);
      if (opts?.featured) q = q.eq("featured", true);
      q = q.order("sort_order", { ascending: true }).order("event_date", { ascending: false });
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
