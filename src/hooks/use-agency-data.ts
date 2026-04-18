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
