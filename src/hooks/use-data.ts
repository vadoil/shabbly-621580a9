import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const usePublishedReleases = () =>
  useQuery({
    queryKey: ["releases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("releases")
        .select("*, tracks(*), platform_links(*)")
        .eq("published", true)
        .order("release_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useFeaturedReleases = () =>
  useQuery({
    queryKey: ["releases_featured"],
    queryFn: async () => {
      // Try featured first
      const { data: featured, error: e1 } = await supabase
        .from("releases")
        .select("*, tracks(*), platform_links(*)")
        .eq("published", true)
        .eq("featured", true)
        .order("release_date", { ascending: false });
      if (e1) throw e1;
      if (featured && featured.length > 0) return featured;
      // Fallback: latest published
      const { data, error } = await supabase
        .from("releases")
        .select("*, tracks(*), platform_links(*)")
        .eq("published", true)
        .order("release_date", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

export const useFeaturedGalleryItems = () =>
  useQuery({
    queryKey: ["gallery_items_featured"],
    queryFn: async () => {
      // Try featured first
      const { data: featured, error: e1 } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .eq("featured", true)
        .not("image_url", "ilike", "%thumb%")
        .order("created_at", { ascending: false })
        .limit(8);
      if (e1) throw e1;
      if (featured && featured.length > 0) return featured;
      // Fallback: latest published
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .not("image_url", "ilike", "%thumb%")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

export const useReleaseBySlug = (slug: string) =>
  useQuery({
    queryKey: ["release", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("releases")
        .select("*, tracks(*), platform_links(*)")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const usePublishedEvents = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .gte("date_start", new Date().toISOString())
        .order("date_start", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const usePublishedNews = () =>
  useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useNewsBySlug = (slug: string) =>
  useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const useFriendEvents = () =>
  useQuery({
    queryKey: ["friend_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friend_events")
        .select("*")
        .gte("date_start", new Date().toISOString())
        .order("date_start", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

export const useSiteSection = (key: string) =>
  useQuery({
    queryKey: ["site_section", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .eq("key", key)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const useSiteSections = (keys: string[]) =>
  useQuery({
    queryKey: ["site_sections", keys],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .in("key", keys)
        .eq("published", true);
      if (error) throw error;
      return data;
    },
    enabled: keys.length > 0,
  });

export const useBandMembers = () =>
  useQuery({
    queryKey: ["band_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("band_members")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const usePartners = () =>
  useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useTeamMembers = () =>
  useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useGalleryAlbums = () =>
  useQuery({
    queryKey: ["gallery_albums"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*, gallery_items(count)")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useGalleryAlbum = (slug: string) =>
  useQuery({
    queryKey: ["gallery_album", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*, gallery_items(*)")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const usePublishedGalleryItems = (limit?: number) =>
  useQuery({
    queryKey: ["gallery_items_all", limit],
    queryFn: async () => {
      let q = supabase
        .from("gallery_items")
        .select("*, album:gallery_albums!inner(slug, title, published)")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useMerchProducts = () =>
  useQuery({
    queryKey: ["merch_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merch_products")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

export const useMerchProduct = (slug: string) =>
  useQuery({
    queryKey: ["merch_product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merch_products")
        .select("*, merch_variants(*)")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const useBarEvents = (start: string, end: string) =>
  useQuery({
    queryKey: ["bar_events", start, end],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bar_events")
        .select("*")
        .eq("published", true)
        .gte("date_start", start)
        .lte("date_start", end)
        .order("date_start", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
