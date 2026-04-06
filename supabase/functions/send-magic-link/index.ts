const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Simple JWT-like token using HMAC
async function createToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${header}.${body}`));
  const sigStr = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${header}.${body}.${sigStr}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, role } = await req.json();
    if (!email) return json({ error: "Email required" }, 400);

    const secret = Deno.env.get("MAGIC_LINK_SECRET");
    if (!secret) return json({ error: "Magic link not configured" }, 500);

    // Verify the email is authorized
    const nicoEmail = Deno.env.get("NICO_EMAIL") || "";
    const gioEmail = Deno.env.get("GIO_EMAIL") || "";

    if (role === "admin" && email.toLowerCase() !== nicoEmail.toLowerCase()) {
      return json({ error: "Unauthorized email" }, 403);
    }
    if (role === "ops" && email.toLowerCase() !== gioEmail.toLowerCase()) {
      return json({ error: "Unauthorized email" }, 403);
    }

    const token = await createToken({ email, role }, secret);
    const baseUrl = role === "ops"
      ? "https://mecca-reboot-buddy.lovable.app/ops"
      : "https://mecca-reboot-buddy.lovable.app/admin";
    const link = `${baseUrl}?token=${token}`;

    // Send via Resend if configured
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Mecca Concierge <noreply@meccadestinations.com>",
          to: email,
          subject: `Your Mecca ${role === "ops" ? "Ops" : "Admin"} Login Link`,
          html: `<h2>Login to Mecca ${role === "ops" ? "Ops" : "Admin"}</h2><p>Click the link below to access your dashboard:</p><p><a href="${link}" style="display:inline-block;padding:12px 24px;background:#4a5d23;color:#fff;text-decoration:none;border-radius:8px">Open Dashboard</a></p><p>This link expires in 7 days.</p>`,
        }),
      });
    }

    // Always return link in response for dev purposes
    return json({ success: true, link });
  } catch (error) {
    console.error("Error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
