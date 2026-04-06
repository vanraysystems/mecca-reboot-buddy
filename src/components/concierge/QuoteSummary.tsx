import { services as allServices, type ConciergeService } from "@/data/services";

interface LineItem {
  serviceId: string;
  quantity: number;
}

interface QuoteSummaryProps {
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  nightlyRate?: number;
  adults?: number;
  selectedServices: LineItem[];
  showVillaSubtotal?: boolean;
  bookingFee?: number;
  securityDeposit?: number;
}

const QuoteSummary = ({
  checkIn,
  checkOut,
  nights = 0,
  nightlyRate = 550,
  adults = 1,
  selectedServices,
  showVillaSubtotal = true,
  bookingFee = 200,
  securityDeposit = 500,
}: QuoteSummaryProps) => {
  const villaSubtotal = nights * nightlyRate;

  const serviceLines = selectedServices
    .filter((s) => s.quantity > 0)
    .map((item) => {
      const svc = allServices.find((s) => s.id === item.serviceId);
      if (!svc) return null;
      const total =
        svc.priceModel === 'per_person'
          ? svc.price * item.quantity * adults
          : svc.price * item.quantity;
      return { service: svc, quantity: item.quantity, total };
    })
    .filter(Boolean) as { service: ConciergeService; quantity: number; total: number }[];

  const servicesTotal = serviceLines.reduce((sum, l) => sum + l.total, 0);
  const grandTotal = (showVillaSubtotal ? villaSubtotal + bookingFee + securityDeposit : 0) + servicesTotal;

  return (
    <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
      <h3 className="font-serif text-xl font-semibold">Quote Summary</h3>

      {showVillaSubtotal && nights > 0 && (
        <div className="space-y-2 border-b border-border pb-4">
          {checkIn && checkOut && (
            <p className="text-sm text-muted-foreground font-sans">{checkIn} → {checkOut}</p>
          )}
          <div className="flex justify-between text-sm font-sans">
            <span>{nights} nights × ${nightlyRate}/night</span>
            <span>${villaSubtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-sans">
            <span>Booking fee</span>
            <span>${bookingFee}</span>
          </div>
          <div className="flex justify-between text-sm font-sans">
            <span>Security deposit (refundable)</span>
            <span>${securityDeposit}</span>
          </div>
        </div>
      )}

      {serviceLines.length > 0 && (
        <div className="space-y-2 border-b border-border pb-4">
          <p className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wide">Concierge Services</p>
          {serviceLines.map((line) => (
            <div key={line.service.id} className="flex justify-between text-sm font-sans">
              <span>
                {line.service.displayName} × {line.quantity}
                {line.service.priceModel === 'per_person' && adults > 1 && ` (${adults} guests)`}
              </span>
              <span>${line.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <span className="font-serif text-lg font-bold">Estimated Total</span>
        <span className="font-serif text-2xl font-bold text-primary">${grandTotal.toLocaleString()}</span>
      </div>

      <p className="text-xs text-muted-foreground font-sans">
        This is an estimate. Final invoice will be sent by Nico within 2 hours.
      </p>
    </div>
  );
};

export default QuoteSummary;
