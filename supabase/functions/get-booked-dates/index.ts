const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory cache
let cachedResult: { blockedDates: string[]; pricing: Record<string, number> } | null = null;
let cacheTime = 0;
let guestyToken: { token: string; expiresAt: number } | null = null;

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function getGuestyToken(): Promise<string | null> {
  const clientId = Deno.env.get("GUESTY_CLIENT_ID");
  const clientSecret = Deno.env.get("GUESTY_CLIENT_SECRET");
  if (!clientId || !clientSecret) return null;

  if (guestyToken && Date.now() < guestyToken.expiresAt) return guestyToken.token;

  const res = await fetch("https://open-api.guesty.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: "client_credentials" }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  guestyToken = { token: data.access_token, expiresAt: Date.now() + 23 * 60 * 60 * 1000 };
  return guestyToken.token;
}

async function fetchGuesty(): Promise<{ blockedDates: string[]; pricing: Record<string, number> } | null> {
  const listingId = Deno.env.get("GUESTY_LISTING_ID");
  if (!listingId) return null;

  const token = await getGuestyToken();
  if (!token) return null;

  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 6);

  const startStr = today.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  const res = await fetch(
    `https://open-api.guesty.com/v1/availability-pricing/api/calendar-listings/${listingId}?startDate=${startStr}&endDate=${endStr}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) return null;
  const data = await res.json();

  const blockedDates: string[] = [];
  const pricing: Record<string, number> = {};

  if (data?.days) {
    for (const day of data.days) {
      const dateStr = day.date?.split("T")[0];
      if (!dateStr) continue;
      if (day.status !== "available") blockedDates.push(dateStr);
      if (day.price) pricing[dateStr] = day.price;
    }
  }

  return { blockedDates, pricing };
}

// Fallback: iCal parser
function parseIcal(text: string): { start: string; end: string }[] {
  const events: { start: string; end: string }[] = [];
  const lines = text.replace(/\r\n /g, "").split(/\r?\n/);
  let inEvent = false, dtstart = "", dtend = "";

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { inEvent = true; dtstart = ""; dtend = ""; }
    else if (line === "END:VEVENT") {
      if (inEvent && dtstart && dtend) events.push({ start: dtstart, end: dtend });
      inEvent = false;
    } else if (inEvent) {
      const sm = line.match(/^DTSTART[^:]*:(\d{4})(\d{2})(\d{2})/);
      const em = line.match(/^DTEND[^:]*:(\d{4})(\d{2})(\d{2})/);
      if (sm) dtstart = `${sm[1]}-${sm[2]}-${sm[3]}`;
      if (em) dtend = `${em[1]}-${em[2]}-${em[3]}`;
    }
  }
  return events;
}

async function fetchIcal(): Promise<{ blockedDates: string[]; pricing: Record<string, number> } | null> {
  const icalUrl = Deno.env.get("AIRBNB_ICAL_URL");
  if (!icalUrl) return null;

  const response = await fetch(icalUrl);
  if (!response.ok) return null;

  const text = await response.text();
  const events = parseIcal(text);

  const bookedDates: string[] = [];
  for (const event of events) {
    const start = new Date(event.start + "T00:00:00");
    const end = new Date(event.end + "T00:00:00");
    const current = new Date(start);
    while (current < end) {
      bookedDates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  }

  return { blockedDates: bookedDates, pricing: {} };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const invalidate = url.searchParams.get("invalidate") === "true";

    if (!invalidate && cachedResult && Date.now() - cacheTime < CACHE_TTL) {
      return new Response(
        JSON.stringify({ success: true, blockedDates: cachedResult.blockedDates, pricing: cachedResult.pricing }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try Guesty first, fall back to iCal
    let result = await fetchGuesty();
    if (!result) result = await fetchIcal();
    if (!result) result = { blockedDates: [], pricing: {} };

    cachedResult = result;
    cacheTime = Date.now();

    return new Response(
      JSON.stringify({ success: true, blockedDates: result.blockedDates, pricing: result.pricing }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
