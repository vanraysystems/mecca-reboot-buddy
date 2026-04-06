import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import StepWizard from "@/components/concierge/StepWizard";
import GuestCounter from "@/components/concierge/GuestCounter";
import ServiceCard from "@/components/concierge/ServiceCard";
import QuoteSummary from "@/components/concierge/QuoteSummary";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/data/services";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";

const guestSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  whatsapp: z.string().trim().min(1, "Required").max(50),
  confirmationNumber: z.string().trim().min(1, "Required").max(100),
});

type GuestFormData = z.infer<typeof guestSchema>;

const Intake = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<"airbnb" | "vrbo">("airbnb");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [dietary, setDietary] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [airportPickup, setAirportPickup] = useState(false);
  const [specialReqs, setSpecialReqs] = useState("");
  const [serviceQtys, setServiceQtys] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: { firstName: "", lastName: "", email: "", whatsapp: "", confirmationNumber: "" },
  });

  const selectedServices = useMemo(
    () => Object.entries(serviceQtys).filter(([, q]) => q > 0).map(([id, quantity]) => {
      const svc = services.find((s) => s.id === id)!;
      const total = svc.priceModel === "per_person" ? svc.price * quantity * adults : svc.price * quantity;
      return { serviceId: id, quantity, total };
    }),
    [serviceQtys, adults]
  );

  const servicesTotal = selectedServices.reduce((s, l) => s + l.total, 0);

  const canContinue = [
    !!(form.watch("confirmationNumber") && checkIn && checkOut),
    form.formState.isValid,
    true,
    true,
    true,
  ][step];

  const handleSubmit = async () => {
    const g = form.getValues();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-booking", {
        body: {
          type: "airbnb_intake",
          first_name: g.firstName,
          last_name: g.lastName,
          name: `${g.firstName} ${g.lastName}`,
          email: g.email,
          whatsapp: g.whatsapp,
          source: platform,
          airbnb_confirmation: g.confirmationNumber,
          check_in: format(checkIn!, "yyyy-MM-dd"),
          check_out: format(checkOut!, "yyyy-MM-dd"),
          guests: adults + children,
          adults,
          children,
          occasion,
          dietary_notes: dietary,
          arrival_time: arrivalTime,
          airport_pickup: airportPickup,
          special_requests: specialReqs,
          services_json: selectedServices,
          estimated_total: servicesTotal,
        },
      });
      if (error) throw error;
      navigate("/confirm", { state: { type: "airbnb_intake", guestName: `${g.firstName} ${g.lastName}`, services: selectedServices, estimatedTotal: servicesTotal } });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 4) handleSubmit();
    else if (step === 1) form.trigger().then((valid) => { if (valid) setStep(step + 1); });
    else setStep(step + 1);
  };

  const steps = [
    {
      label: "Booking",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Booking Details</h2>
          <div>
            <Label className="font-sans">Platform</Label>
            <RadioGroup value={platform} onValueChange={(v: any) => setPlatform(v)} className="mt-2 flex gap-4">
              <div className="flex items-center gap-2"><RadioGroupItem value="airbnb" id="plat-airbnb" /><Label htmlFor="plat-airbnb" className="font-sans">Airbnb</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="vrbo" id="plat-vrbo" /><Label htmlFor="plat-vrbo" className="font-sans">Vrbo</Label></div>
            </RadioGroup>
          </div>
          <div><Label className="font-sans">Confirmation Number *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("confirmationNumber")} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label className="font-sans mb-2 block">Check-in</Label><Calendar mode="single" selected={checkIn} onSelect={setCheckIn} className="rounded-2xl border p-3 pointer-events-auto" /></div>
            <div><Label className="font-sans mb-2 block">Check-out</Label><Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => !checkIn || d <= checkIn} className="rounded-2xl border p-3 pointer-events-auto" /></div>
          </div>
        </div>
      ),
    },
    {
      label: "Guest Info",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Guest Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label className="font-sans">First Name *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("firstName")} /></div>
            <div><Label className="font-sans">Last Name *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("lastName")} /></div>
            <div><Label className="font-sans">Email *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("email")} /></div>
            <div><Label className="font-sans">WhatsApp / Phone *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("whatsapp")} /></div>
          </div>
        </div>
      ),
    },
    {
      label: "Group & Prefs",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Group & Preferences</h2>
          <div className="flex flex-col md:flex-row gap-12 justify-center items-center py-4">
            <GuestCounter label="Adults" value={adults} min={1} max={20} onChange={setAdults} />
            <GuestCounter label="Children" value={children} min={0} max={10} onChange={setChildren} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="font-sans">Occasion</Label>
              <Select value={occasion} onValueChange={setOccasion}><SelectTrigger className="rounded-xl bg-background mt-1"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{["Birthday", "Bachelor/Bachelorette", "Anniversary", "Family Vacation", "Friends Trip", "Corporate", "Honeymoon", "Other"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
            </div>
            <div>
              <Label className="font-sans">Arrival Time</Label>
              <RadioGroup value={arrivalTime} onValueChange={setArrivalTime} className="mt-2 space-y-2">
                {["Before 12pm", "12pm-3pm", "3pm-6pm", "After 6pm"].map((t) => <div key={t} className="flex items-center gap-2"><RadioGroupItem value={t} id={`it-${t}`} /><Label htmlFor={`it-${t}`} className="font-sans text-sm">{t}</Label></div>)}
              </RadioGroup>
            </div>
            <div className="md:col-span-2"><Label className="font-sans">Dietary Needs</Label><Textarea className="rounded-xl bg-background mt-1" value={dietary} onChange={(e) => setDietary(e.target.value)} /></div>
            <div className="flex items-center gap-3"><Switch checked={airportPickup} onCheckedChange={setAirportPickup} /><Label className="font-sans">Airport Pickup</Label></div>
            <div className="md:col-span-2"><Label className="font-sans">Special Requests</Label><Textarea className="rounded-xl bg-background mt-1" value={specialReqs} onChange={(e) => setSpecialReqs(e.target.value)} /></div>
          </div>
        </div>
      ),
    },
    {
      label: "Services",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Concierge Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.filter((s) => s.active).map((svc) => (
              <ServiceCard key={svc.id} service={svc} quantity={serviceQtys[svc.id] || 0} adults={adults} onQuantityChange={(q) => setServiceQtys((p) => ({ ...p, [svc.id]: q }))} />
            ))}
          </div>
          {servicesTotal > 0 && (
            <div className="sticky bottom-0 bg-background/95 backdrop-blur p-4 rounded-2xl border text-center">
              <p className="font-serif text-lg">Services Total: <span className="text-primary font-bold">${servicesTotal.toLocaleString()}</span></p>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Review",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Review & Submit</h2>
          <QuoteSummary adults={adults} selectedServices={selectedServices} showVillaSubtotal={false} />
          <p className="text-sm text-muted-foreground font-sans">Concierge services are billed separately via Stripe invoice. Your {platform === "airbnb" ? "Airbnb" : "Vrbo"} nightly rate is not affected.</p>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-serif text-center mb-2">Already Booked?</h1>
            <p className="text-center font-sans text-muted-foreground mb-8">Add concierge services to your Airbnb or Vrbo reservation</p>
          </ScrollReveal>
          <StepWizard steps={steps} currentStep={step} onNext={handleNext} onBack={() => setStep(Math.max(0, step - 1))} canContinue={canContinue} isSubmitting={isSubmitting} />
        </div>
      </section>
    </Layout>
  );
};

export default Intake;
