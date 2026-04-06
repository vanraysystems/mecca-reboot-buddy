import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BookingCard from "@/components/admin/BookingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

const Ops = () => {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      localStorage.setItem("ops_token", t);
      setAuthed(true);
      window.history.replaceState({}, "", "/ops");
    } else if (localStorage.getItem("ops_token")) {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchBookings();
  }, [authed]);

  const fetchBookings = async () => {
    const { data } = await supabase.functions.invoke("submit-booking", {
      body: { action: "list_bookings" },
    });
    if (data?.bookings) {
      setBookings(
        data.bookings
          .filter((b: any) => ["paid", "gio_briefed", "invoiced"].includes(b.status))
          .sort((a: any, b: any) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
      );
    }
  };

  const sendMagicLink = async () => {
    if (!email) return;
    try {
      const { error } = await supabase.functions.invoke("send-magic-link", { body: { email, role: "ops" } });
      if (error) throw error;
      toast({ title: "Magic link sent!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleAction = async (bookingId: string, action: string) => {
    try {
      const { error } = await supabase.functions.invoke("submit-booking", {
        body: { action, booking_id: bookingId },
      });
      if (error) throw error;
      toast({ title: "Updated!" });
      fetchBookings();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (!authed) {
    return (
      <Layout>
        <section className="py-20 px-6">
          <div className="max-w-md mx-auto text-center space-y-6">
            <h1 className="text-3xl font-serif">Ops Dashboard</h1>
            <p className="font-sans text-muted-foreground">Enter your email to receive a login link.</p>
            <Input className="rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="gio@example.com" />
            <Button onClick={sendMagicLink} className="rounded-full bg-primary text-primary-foreground w-full font-sans uppercase tracking-wide">Send Magic Link</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-serif">Ops Dashboard</h1>
            <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem("ops_token"); setAuthed(false); }}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} showPricing={false} actions={
                <>
                  {!b.gio_briefed_at && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "mark_briefed")}>Mark Briefed</Button>}
                  {b.status === "paid" && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "mark_completed")}>Mark Complete</Button>}
                </>
              } />
            ))}
            {bookings.length === 0 && <p className="text-center text-muted-foreground font-sans py-12">No confirmed bookings yet.</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ops;
