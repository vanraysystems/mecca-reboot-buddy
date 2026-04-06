import { useState } from "react";
import { ChevronDown, ChevronUp, User, Calendar, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { services as allServices } from "@/data/services";

interface BookingData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  type: string;
  status: string;
  check_in: string;
  check_out: string;
  adults: number | null;
  children: number | null;
  guests: number;
  occasion: string | null;
  dietary_notes: string | null;
  special_requests: string | null;
  arrival_time: string | null;
  airport_pickup: boolean | null;
  whatsapp: string | null;
  source: string | null;
  airbnb_confirmation: string | null;
  services_json: any;
  estimated_total: number | null;
  final_total: number | null;
  villa_area: string | null;
  created_at: string;
}

interface BookingCardProps {
  booking: BookingData;
  showPricing?: boolean;
  actions?: React.ReactNode;
}

const typeLabels: Record<string, string> = {
  direct_booking: "Direct",
  airbnb_intake: "Airbnb",
  midstay_order: "Mid-Stay",
};

const BookingCard = ({ booking, showPricing = true, actions }: BookingCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const guestName = [booking.first_name, booking.last_name].filter(Boolean).join(" ") || booking.name;
  const servicesArr = Array.isArray(booking.services_json) ? booking.services_json : [];

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <button
        type="button"
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-serif font-semibold truncate">{guestName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
              <Calendar className="h-3 w-3" />
              <span>{booking.check_in} → {booking.check_out}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className="font-sans text-xs">{typeLabels[booking.type] || booking.type}</Badge>
          <StatusBadge status={booking.status} />
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans">
            <div><span className="text-muted-foreground">Email:</span> {booking.email}</div>
            {booking.whatsapp && <div><span className="text-muted-foreground">WhatsApp:</span> {booking.whatsapp}</div>}
            <div><span className="text-muted-foreground">Adults:</span> {booking.adults || booking.guests}</div>
            {(booking.children ?? 0) > 0 && <div><span className="text-muted-foreground">Children:</span> {booking.children}</div>}
            {booking.occasion && <div><span className="text-muted-foreground">Occasion:</span> {booking.occasion}</div>}
            {booking.arrival_time && <div><span className="text-muted-foreground">Arrival:</span> {booking.arrival_time}</div>}
            {booking.airport_pickup && <div><span className="text-muted-foreground">Airport Pickup:</span> Yes</div>}
            {booking.source && <div><span className="text-muted-foreground">Source:</span> {booking.source}</div>}
            {booking.airbnb_confirmation && <div><span className="text-muted-foreground">Confirmation #:</span> {booking.airbnb_confirmation}</div>}
            {booking.villa_area && <div><span className="text-muted-foreground">Villa Area:</span> {booking.villa_area}</div>}
          </div>

          {booking.dietary_notes && (
            <div className="text-sm font-sans">
              <span className="text-muted-foreground">Dietary Notes:</span>
              <p className="mt-1">{booking.dietary_notes}</p>
            </div>
          )}

          {booking.special_requests && (
            <div className="text-sm font-sans">
              <span className="text-muted-foreground">Special Requests:</span>
              <p className="mt-1">{booking.special_requests}</p>
            </div>
          )}

          {servicesArr.length > 0 && (
            <div className="text-sm font-sans">
              <span className="text-muted-foreground">Services:</span>
              <ul className="mt-1 space-y-1">
                {servicesArr.map((s: any, i: number) => {
                  const svc = allServices.find((sv) => sv.id === s.serviceId);
                  return (
                    <li key={i} className="flex justify-between">
                      <span>{svc?.displayName || s.serviceId} × {s.quantity}</span>
                      {showPricing && s.total != null && <span>${s.total}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {showPricing && (booking.estimated_total || booking.final_total) && (
            <div className="flex justify-between font-serif font-semibold text-lg border-t border-border pt-3">
              <span>Total</span>
              <span className="text-primary">${(booking.final_total || booking.estimated_total)?.toLocaleString()}</span>
            </div>
          )}

          {actions && <div className="flex gap-2 pt-2">{actions}</div>}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
