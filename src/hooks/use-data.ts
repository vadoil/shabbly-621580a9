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
