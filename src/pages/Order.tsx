import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/concierge/ServiceCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/data/services";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";
import { CheckCircle } from "lucide-react";

const orderSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
});

const villaAreas = ["Kitchen", "Pool Deck", "Master Suite", "Main Terrace", "Garden Room"];
const midstayServices = services.filter((s) => s.availableInMidstay && s.active);

const Order = () => {
  const [villaArea, setVillaArea] = useState("");
  const [serviceQtys, setServiceQtys] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({ resolver: zodResolver(orderSchema), defaultValues: { firstName: "", email: "" } });

  const selectedServices = useMemo(
    () => Object.entries(serviceQtys).filter(([, q]) => q > 0).map(([id, quantity]) => {
      const svc = midstayServices.find((s) => s.id === id)!;
      const total = svc.priceModel === "per_person" ? svc.price * quantity : svc.price * quantity;
      return { serviceId: id, quantity, total };
    }),
    [serviceQtys]
  );

  const total = selectedServices.reduce((s, l) => s + l.total, 0);

  const handleSubmit = async () => {
    const valid = await form.trigger();
    if (!valid || !villaArea || selectedServices.length === 0) {
      toast({ title: "Please fill all required fields and select at least one service", variant: "destructive" });
      return;
    }
    const g = form.getValues();
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase.functions.invoke("submit-booking", {
        body: {
          type: "midstay_order",
          first_name: g.firstName,
          name: g.firstName,
          email: g.email,
          villa_area: villaArea,
          check_in: today,
          check_out: today,
          guests: 1,
          services_json: selectedServices,
          estimated_total: total,
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <section className="py-20 px-6 text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-3xl font-serif">Order Received!</h1>
            <p className="font-sans text-muted-foreground">Gio will coordinate delivery. Payment will be added to your balance and charged on your last morning.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-serif text-center">In-Villa Orders</h1>
            <p className="text-center font-sans text-muted-foreground mt-2">Need something? We'll bring it to you.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label className="font-sans">Your Name *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("firstName")} /></div>
            <div><Label className="font-sans">Email *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("email")} /></div>
          </div>

          <div>
            <Label className="font-sans">Villa Area *</Label>
            <Select value={villaArea} onValueChange={setVillaArea}>
              <SelectTrigger className="rounded-xl bg-background mt-1"><SelectValue placeholder="Where are you?" /></SelectTrigger>
              <SelectContent>{villaAreas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {midstayServices.map((svc) => (
              <ServiceCard key={svc.id} service={svc} quantity={serviceQtys[svc.id] || 0} onQuantityChange={(q) => setServiceQtys((p) => ({ ...p, [svc.id]: q }))} />
            ))}
          </div>

          {total > 0 && (
            <div className="sticky bottom-0 bg-background/95 backdrop-blur p-4 rounded-2xl border text-center space-y-3">
              <p className="font-serif text-lg">Total: <span className="text-primary font-bold">${total.toLocaleString()}</span></p>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wide px-8 w-full md:w-auto">
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Order;
