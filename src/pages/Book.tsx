import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays } from "date-fns";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  source: z.string().min(1, "Please select"),
});

type GuestFormData = z.infer<typeof guestSchema>;

const DEFAULT_RATE = 550;

const Book = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [bookedDates, setBD] = useState<Set<string>>(new Set());
  const [pricingMap, setPM] = useState<Record<string, number>>({});
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [dietary, setDietary] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [airportPickup, setAirportPickup] = useState(false);
  const [specialReqs, setSpecialReqs] = useState("");
  const [serviceQtys, setServiceQtys] = useState<Record<string, number>>({});
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: { firstName: "", lastName: "", email: "", whatsapp: "", source: "" },
  });

  useEffect(() => {
    supabase.functions.invoke("get-booked-dates").then(({ data }) => {
      if (data?.success && data.bookedDates) setBD(new Set(data.bookedDates));
      if (data?.pricing) setPM(data.pricing);
    });
  }, []);

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const nightlyRate = checkIn ? (pricingMap[format(checkIn, "yyyy-MM-dd")] || DEFAULT_RATE) : DEFAULT_RATE;

  const selectedServices = useMemo(
    () => Object.entries(serviceQtys).filter(([, q]) => q > 0).map(([id, quantity]) => {
      const svc = services.find((s) => s.id === id)!;
      const total = svc.priceModel === "per_person" ? svc.price * quantity * adults : svc.price * quantity;
      return { serviceId: id, quantity, total };
    }),
    [serviceQtys, adults]
  );

  const servicesTotal = selectedServices.reduce((s, l) => s + l.total, 0);
  const estimatedTotal = nights * nightlyRate + 200 + 500 + servicesTotal;

  const canContinue = [
    !!(checkIn && checkOut && nights > 0),
    form.formState.isValid,
    true,
    true,
    true,
    true,
    agreed,
  ][step];

  const handleSubmit = async () => {
    const guest = form.getValues();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-booking", {
        body: {
          type: "direct_booking",
          first_name: guest.firstName,
          last_name: guest.lastName,
          name: `${guest.firstName} ${guest.lastName}`,
          email: guest.email,
          whatsapp: guest.whatsapp,
          source: guest.source,
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
          estimated_total: estimatedTotal,
        },
      });
      if (error) throw error;
      navigate("/confirm", {
        state: {
          type: "direct_booking",
          guestName: `${guest.firstName} ${guest.lastName}`,
          checkIn: format(checkIn!, "PPP"),
          checkOut: format(checkOut!, "PPP"),
          services: selectedServices,
          estimatedTotal,
        },
      });
    } catch (e: any) {
      toast({ title: "Error submitting booking", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 6) {
      handleSubmit();
    } else {
      if (step === 1) {
        form.trigger().then((valid) => { if (valid) setStep(step + 1); });
      } else {
        setStep(step + 1);
      }
    }
  };

  const steps = [
    {
      label: "Dates",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Select Your Dates</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Label className="font-sans mb-2 block">Check-in</Label>
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(d) => { setCheckIn(d); if (checkOut && d && d >= checkOut) setCheckOut(undefined); }}
                disabled={(date) => date < new Date() || bookedDates.has(format(date, "yyyy-MM-dd"))}
                className="rounded-2xl border border-border p-3 pointer-events-auto"
              />
            </div>
            <div className="flex-1">
              <Label className="font-sans mb-2 block">Check-out</Label>
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => !checkIn || date <= checkIn || bookedDates.has(format(date, "yyyy-MM-dd"))}
                className="rounded-2xl border border-border p-3 pointer-events-auto"
              />
            </div>
          </div>
          {nights > 0 && (
            <div className="rounded-2xl bg-primary/5 p-4 text-center">
              <p className="font-serif text-lg">{nights} nights at <span className="text-primary font-bold">${nightlyRate}/night</span></p>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Guest Info",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Guest Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label className="font-sans">First Name *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("firstName")} />{form.formState.errors.firstName && <p className="text-xs text-destructive mt-1">{form.formState.errors.firstName.message}</p>}</div>
            <div><Label className="font-sans">Last Name *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("lastName")} />{form.formState.errors.lastName && <p className="text-xs text-destructive mt-1">{form.formState.errors.lastName.message}</p>}</div>
            <div><Label className="font-sans">Email *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("email")} />{form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}</div>
            <div><Label className="font-sans">WhatsApp / Phone *</Label><Input className="rounded-xl bg-background mt-1" {...form.register("whatsapp")} />{form.formState.errors.whatsapp && <p className="text-xs text-destructive mt-1">{form.formState.errors.whatsapp.message}</p>}</div>
          </div>
          <div>
            <Label className="font-sans">How did you hear about us? *</Label>
            <Select value={form.watch("source")} onValueChange={(v) => form.setValue("source", v, { shouldValidate: true })}>
              <SelectTrigger className="rounded-xl bg-background mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {["Instagram", "Referral", "YouTube", "Google", "Level 5", "LinkedIn", "Other"].map((s) => (
                  <SelectItem key={s} value={s.toLowerCase().replace(/ /g, "")}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      label: "Group Size",
      content: (
        <div className="space-y-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif">Group Size</h2>
          <div className="flex flex-col md:flex-row gap-12 justify-center items-center py-8">
            <GuestCounter label="Adults" value={adults} min={1} max={20} onChange={setAdults} />
            <GuestCounter label="Children" value={children} min={0} max={10} onChange={setChildren} />
          </div>
          <p className="text-lg font-sans text-muted-foreground">{adults + children} guests total</p>
        </div>
      ),
    },
    {
      label: "Preferences",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="font-sans">Occasion</Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger className="rounded-xl bg-background mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {["Birthday", "Bachelor/Bachelorette", "Anniversary", "Family Vacation", "Friends Trip", "Corporate", "Honeymoon", "Other"].map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-sans">Expected Arrival Time</Label>
              <RadioGroup value={arrivalTime} onValueChange={setArrivalTime} className="mt-2 space-y-2">
                {["Before 12pm", "12pm-3pm", "3pm-6pm", "After 6pm"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <RadioGroupItem value={t} id={`at-${t}`} />
                    <Label htmlFor={`at-${t}`} className="font-sans text-sm">{t}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="md:col-span-2">
              <Label className="font-sans">Dietary Needs</Label>
              <Textarea className="rounded-xl bg-background mt-1" value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="Any allergies or dietary requirements..." />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={airportPickup} onCheckedChange={setAirportPickup} />
              <Label className="font-sans">Airport Pickup</Label>
            </div>
            {airportPickup && <p className="text-xs text-muted-foreground font-sans md:col-span-2">Vehicle type confirmed after booking.</p>}
            <div className="md:col-span-2">
              <Label className="font-sans">Special Requests</Label>
              <Textarea className="rounded-xl bg-background mt-1" value={specialReqs} onChange={(e) => setSpecialReqs(e.target.value)} placeholder="Anything else we should know..." />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Services",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Customize Your Stay</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.filter((s) => s.active).map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                quantity={serviceQtys[svc.id] || 0}
                adults={adults}
                onQuantityChange={(q) => setServiceQtys((prev) => ({ ...prev, [svc.id]: q }))}
              />
            ))}
          </div>
          {servicesTotal > 0 && (
            <div className="sticky bottom-0 bg-background/95 backdrop-blur p-4 rounded-2xl border border-border text-center">
              <p className="font-serif text-lg">Services Total: <span className="text-primary font-bold">${servicesTotal.toLocaleString()}</span></p>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Quote",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Your Quote</h2>
          <QuoteSummary
            checkIn={checkIn ? format(checkIn, "PPP") : undefined}
            checkOut={checkOut ? format(checkOut, "PPP") : undefined}
            nights={nights}
            nightlyRate={nightlyRate}
            adults={adults}
            selectedServices={selectedServices}
            showVillaSubtotal={true}
          />
        </div>
      ),
    },
    {
      label: "Submit",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif">Review Your Booking</h2>
          <div className="rounded-2xl bg-card border border-border p-6 space-y-3 text-sm font-sans">
            <p><span className="text-muted-foreground">Guest:</span> {form.watch("firstName")} {form.watch("lastName")}</p>
            <p><span className="text-muted-foreground">Email:</span> {form.watch("email")}</p>
            <p><span className="text-muted-foreground">Dates:</span> {checkIn && format(checkIn, "PPP")} → {checkOut && format(checkOut, "PPP")}</p>
            <p><span className="text-muted-foreground">Group:</span> {adults} adults, {children} children</p>
            {occasion && <p><span className="text-muted-foreground">Occasion:</span> {occasion}</p>}
            <p className="font-serif text-lg font-bold pt-3">Estimated Total: <span className="text-primary">${estimatedTotal.toLocaleString()}</span></p>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} id="agree" />
            <Label htmlFor="agree" className="font-sans text-sm leading-relaxed">
              I understand this is a booking request and my deposit invoice will follow.
            </Label>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-serif text-center mb-2">Book Your Stay</h1>
            <p className="text-center font-sans text-muted-foreground mb-8">Direct booking with full concierge services</p>
          </ScrollReveal>
          <StepWizard
            steps={steps}
            currentStep={step}
            onNext={handleNext}
            onBack={() => setStep(Math.max(0, step - 1))}
            canContinue={canContinue}
            isSubmitting={isSubmitting}
          />
        </div>
      </section>
    </Layout>
  );
};

export default Book;
