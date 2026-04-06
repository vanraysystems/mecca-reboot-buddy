import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { CheckCircle, FileText, CreditCard, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const messages: Record<string, string> = {
  direct_booking: "Nico will review your request and send a deposit invoice within 2 hours.",
  airbnb_intake: "Expect a Stripe invoice for your concierge services within 24 hours.",
  midstay_order: "Your order has been received. Gio is on it!",
};

const Confirm = () => {
  const { state } = useLocation();
  const type = state?.type || "direct_booking";

  return (
    <Layout>
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <CheckCircle className="h-20 w-20 text-primary animate-fade-in" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif animate-fade-in" style={{ animationDelay: "0.1s" }}>
            You're All Set!
          </h1>

          {state?.guestName && <p className="text-lg font-sans text-muted-foreground">Thank you, {state.guestName}!</p>}

          {state?.checkIn && state?.checkOut && (
            <p className="font-sans text-muted-foreground">{state.checkIn} → {state.checkOut}</p>
          )}

          {state?.estimatedTotal && (
            <p className="font-serif text-2xl font-bold text-primary">Estimated Total: ${state.estimatedTotal.toLocaleString()}</p>
          )}

          <p className="font-sans text-muted-foreground max-w-md mx-auto">{messages[type]}</p>

          <div className="pt-8">
            <h2 className="text-xl font-serif mb-6">What Happens Next</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: FileText, title: "Invoice Sent", desc: "You'll receive a Stripe invoice via email" },
                { icon: CreditCard, title: "Payment Confirmed", desc: "Your services are locked in once paid" },
                { icon: UserCheck, title: "Gio Prepares", desc: "Our on-ground team handles everything" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-card border border-border p-6 text-center space-y-3">
                  <item.icon className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-serif font-semibold">{item.title}</h3>
                  <p className="text-sm font-sans text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wide px-8 mt-8">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Confirm;
