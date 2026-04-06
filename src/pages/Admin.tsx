import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import BookingCard from "@/components/admin/BookingCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LayoutDashboard, List, BarChart3, LogOut } from "lucide-react";

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [tab, setTab] = useState<"overview" | "bookings" | "pnl">("overview");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Check token from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      localStorage.setItem("admin_token", t);
      setAuthed(true);
      window.history.replaceState({}, "", "/admin");
    } else if (localStorage.getItem("admin_token")) {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchBookings();
  }, [authed]);

  const fetchBookings = async () => {
    setLoading(true);
    // Use edge function to fetch bookings (service role)
    const { data, error } = await supabase.functions.invoke("submit-booking", {
      body: { action: "list_bookings" },
    });
    if (data?.bookings) setBookings(data.bookings);
    setLoading(false);
  };

  const sendMagicLink = async () => {
    if (!email) return;
    try {
      const { error } = await supabase.functions.invoke("send-magic-link", { body: { email, role: "admin" } });
      if (error) throw error;
      toast({ title: "Magic link sent!", description: "Check your email for the login link." });
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
            <h1 className="text-3xl font-serif">Mecca Admin</h1>
            <p className="font-sans text-muted-foreground">Enter your email to receive a login link.</p>
            <Input className="rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nico@meccainvestmentgroup.com" />
            <Button onClick={sendMagicLink} className="rounded-full bg-primary text-primary-foreground w-full font-sans uppercase tracking-wide">Send Magic Link</Button>
          </div>
        </section>
      </Layout>
    );
  }

  const filtered = bookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (filterType !== "all" && b.type !== filterType) return false;
    return true;
  });

  const thisMonth = bookings.filter((b) => {
    const d = new Date(b.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const stats = [
    { label: "Bookings This Month", value: thisMonth.length },
    { label: "Revenue This Month", value: `$${thisMonth.reduce((s: number, b: any) => s + (b.estimated_total || 0), 0).toLocaleString()}` },
    { label: "Pending Requests", value: bookings.filter((b) => b.status === "submitted" || b.status === "pending").length },
    { label: "Upcoming Check-ins", value: bookings.filter((b) => new Date(b.check_in) >= new Date() && b.status !== "cancelled").length },
  ];

  const navItems = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "bookings" as const, label: "Bookings", icon: List },
    { id: "pnl" as const, label: "P&L", icon: BarChart3 },
  ];

  return (
    <Layout>
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-serif">Mecca Admin</h1>
            <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem("admin_token"); setAuthed(false); }}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>

          {/* Tab nav */}
          <div className="flex gap-2 mb-8 border-b border-border pb-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={tab === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setTab(item.id)}
                className="font-sans"
              >
                <item.icon className="h-4 w-4 mr-1" /> {item.label}
              </Button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-card border border-border p-4 text-center">
                    <p className="text-2xl font-serif font-bold">{s.value}</p>
                    <p className="text-xs font-sans text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <h2 className="text-xl font-serif">Upcoming Bookings</h2>
              <div className="space-y-3">
                {bookings
                  .filter((b) => new Date(b.check_in) >= new Date() && b.status !== "cancelled")
                  .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime())
                  .slice(0, 10)
                  .map((b) => (
                    <BookingCard key={b.id} booking={b} actions={
                      <>
                        {b.status === "submitted" && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "mark_invoiced")}>Send Invoice</Button>}
                        {b.status === "paid" && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "mark_completed")}>Mark Complete</Button>}
                        {b.status !== "cancelled" && <Button size="sm" variant="destructive" onClick={() => handleAction(b.id, "cancel")}>Cancel</Button>}
                      </>
                    } />
                  ))}
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div className="space-y-6">
              <div className="flex gap-4 flex-wrap">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {["submitted", "invoiced", "paid", "completed", "cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="direct_booking">Direct</SelectItem>
                    <SelectItem value="airbnb_intake">Airbnb</SelectItem>
                    <SelectItem value="midstay_order">Mid-Stay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                {filtered.map((b) => (
                  <BookingCard key={b.id} booking={b} actions={
                    <>
                      {b.status === "submitted" && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "mark_invoiced")}>Send Invoice</Button>}
                      {b.status === "paid" && <Button size="sm" variant="outline" onClick={() => handleAction(b.id, "mark_completed")}>Mark Complete</Button>}
                      {b.status !== "cancelled" && <Button size="sm" variant="destructive" onClick={() => handleAction(b.id, "cancel")}>Cancel</Button>}
                    </>
                  } />
                ))}
                {filtered.length === 0 && <p className="text-center text-muted-foreground font-sans py-8">No bookings found.</p>}
              </div>
            </div>
          )}

          {tab === "pnl" && (
            <div className="space-y-6">
              <p className="font-sans text-muted-foreground text-center py-12">P&L tracking coming soon. Revenue data is calculated from booking totals above.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
