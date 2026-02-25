const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function parseIcal(text: string): { start: string; end: string }[] {
  const events: { start: string; end: string }[] = [];
  const lines = text.replace(/\r\n /g, '').split(/\r?\n/);

  let inEvent = false;
  let dtstart = '';
  let dtend = '';

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      dtstart = '';
      dtend = '';
    } else if (line === 'END:VEVENT') {
      if (inEvent && dtstart && dtend) {
        events.push({ start: dtstart, end: dtend });
      }
      inEvent = false;
    } else if (inEvent) {
      // Match DTSTART;VALUE=DATE:20250301 or DTSTART:20250301T120000Z
      const startMatch = line.match(/^DTSTART[^:]*:(\d{4})(\d{2})(\d{2})/);
      const endMatch = line.match(/^DTEND[^:]*:(\d{4})(\d{2})(\d{2})/);
      if (startMatch) {
        dtstart = `${startMatch[1]}-${startMatch[2]}-${startMatch[3]}`;
      }
      if (endMatch) {
        dtend = `${endMatch[1]}-${endMatch[2]}-${endMatch[3]}`;
      }
    }
  }

  return events;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const icalUrl = Deno.env.get('AIRBNB_ICAL_URL');
    if (!icalUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'iCal URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(icalUrl);
    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `Failed to fetch iCal: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const text = await response.text();
    const events = parseIcal(text);

    // Expand events into individual booked dates (start inclusive, end exclusive per iCal spec)
    const bookedDates: string[] = [];
    for (const event of events) {
      const start = new Date(event.start + 'T00:00:00');
      const end = new Date(event.end + 'T00:00:00');
      const current = new Date(start);
      while (current < end) {
        bookedDates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    }

    return new Response(
      JSON.stringify({ success: true, bookedDates }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching iCal:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
