import { supabase } from "@/integrations/supabase/client";

export type NotifyType =
  | "artist_application"
  | "event_inquiry"
  | "ticket_request"
  | "merch_request";

/**
 * Fire-and-forget Telegram notification. Errors are logged only —
 * never block the user-facing form submission flow.
 */
export function notifyTelegram(type: NotifyType, data: Record<string, unknown>) {
  try {
    supabase.functions
      .invoke("notify-telegram", { body: { type, data } })
      .catch((err) => console.warn("notify-telegram failed", err));
  } catch (err) {
    console.warn("notify-telegram failed", err);
  }
}
