const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory cache
let cachedResult: { blockedDates: string[]; pricing: Record<string, number> } | null = null;
let cacheTime = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

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

async function fetchIcal(): Promise<{ blockedDates: string[]; pricing: Record<string, number> }> {
  const icalUrl = Deno.env.get("AIRBNB_ICAL_URL");
  if (!icalUrl) {
    console.error("AIRBNB_ICAL_URL not configured");
    return { blockedDates: [], pricing: {} };
  }

  const response = await fetch(icalUrl);
  if (!response.ok) {
    console.error("iCal fetch failed:", response.status);
    return { blockedDates: [], pricing: {} };
  }

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

  console.log(`iCal sync: ${events.length} events → ${bookedDates.length} blocked dates`);
  return { blockedDates, pricing: {} };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const invalidate = url.searchParams.get("invalidate") === "true";

    if (!invalidate && cachedResult && Date.now() - cacheTime < CACHE_TTL) {
      return new Response(
        JSON.stringify({ success: true, bookedDates: cachedResult.blockedDates, blockedDates: cachedResult.blockedDates, pricing: cachedResult.pricing, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await fetchIcal();
    cachedResult = result;
    cacheTime = Date.now();

    return new Response(
      JSON.stringify({ success: true, bookedDates: result.blockedDates, blockedDates: result.blockedDates, pricing: result.pricing, cached: false }),
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
