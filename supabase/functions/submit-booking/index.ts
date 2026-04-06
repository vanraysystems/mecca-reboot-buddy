import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const { action } = body;

    // --- Admin actions ---
    if (action === "list_bookings") {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) return json({ error: error.message }, 500);
      return json({ bookings: data });
    }

    if (action === "mark_invoiced") {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "invoiced" })
        .eq("id", body.booking_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "mark_completed") {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "completed" })
        .eq("id", body.booking_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "mark_briefed") {
      const { error } = await supabase
        .from("bookings")
        .update({ gio_briefed_at: new Date().toISOString() })
        .eq("id", body.booking_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "cancel") {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", body.booking_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    // --- Booking submission ---
    const {
      type,
      first_name,
      last_name,
      name,
      email,
      whatsapp,
      source,
      airbnb_confirmation,
      check_in,
      check_out,
      guests,
      adults,
      children,
      occasion,
      dietary_notes,
      arrival_time,
      airport_pickup,
      special_requests,
      services_json,
      estimated_total,
      villa_area,
    } = body;

    // Validate required fields
    if (!type || !email || !check_in || !check_out) {
      return json({ error: "Missing required fields" }, 400);
    }

    if (type === "direct_booking" && (!first_name || !last_name)) {
      return json({ error: "First name and last name required for direct booking" }, 400);
    }

    if (type === "airbnb_intake" && !airbnb_confirmation) {
      return json({ error: "Confirmation number required for Airbnb intake" }, 400);
    }

    if (type === "midstay_order" && (!villa_area || !services_json?.length)) {
      return json({ error: "Villa area and services required for mid-stay order" }, 400);
    }

    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        type,
        first_name,
        last_name,
        name: name || `${first_name || ""} ${last_name || ""}`.trim(),
        email,
        whatsapp,
        source,
        airbnb_confirmation,
        check_in,
        check_out,
        guests: guests || 1,
        adults,
        children,
        occasion,
        dietary_notes,
        arrival_time,
        airport_pickup,
        special_requests,
        services_json,
        estimated_total,
        villa_area,
        status: "submitted",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return json({ error: insertError.message }, 500);
    }

    // Send notification email to Nico (best-effort)
    const nicoEmail = Deno.env.get("NICO_EMAIL");
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (nicoEmail && resendKey) {
      const subjects: Record<string, string> = {
        direct_booking: `New Direct Booking Request — ${first_name} ${last_name} | ${check_in}`,
        airbnb_intake: `Airbnb Guest Concierge Request — ${first_name} ${last_name} | ${check_in}`,
        midstay_order: `URGENT: Mid-Stay Order — ${first_name} | ${villa_area}`,
      };

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Mecca Concierge <bookings@meccadestinations.com>",
            to: nicoEmail,
            subject: subjects[type] || "New Booking Request",
            html: `<h2>${subjects[type]}</h2><p><strong>Guest:</strong> ${first_name || name} ${last_name || ""}</p><p><strong>Email:</strong> ${email}</p><p><strong>Dates:</strong> ${check_in} → ${check_out}</p><p><strong>Guests:</strong> ${adults || guests}</p>${estimated_total ? `<p><strong>Estimated Total:</strong> $${estimated_total}</p>` : ""}<p><a href="https://mecca-reboot-buddy.lovable.app/admin">View in Admin →</a></p>`,
          }),
        });
      } catch (e) {
        console.error("Email send error:", e);
      }
    }

    return json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error("Error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
