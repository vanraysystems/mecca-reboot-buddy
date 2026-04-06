import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConciergeService } from "@/data/services";

interface ServiceCardProps {
  service: ConciergeService;
  quantity: number;
  adults?: number;
  onQuantityChange: (quantity: number) => void;
}

const ServiceCard = ({ service, quantity, adults = 1, onQuantityChange }: ServiceCardProps) => {
  const lineTotal = service.priceModel === 'per_person'
    ? service.price * quantity * adults
    : service.price * quantity;

  return (
    <div className="rounded-2xl overflow-hidden bg-card shadow-md border border-border">
      <div className="h-40 overflow-hidden">
        <img
          src={service.imagePlaceholder}
          alt={service.displayName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-serif text-lg font-semibold">{service.displayName}</h3>
          <p className="text-sm text-muted-foreground font-sans">{service.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-sans font-medium text-primary">
            ${service.price} <span className="text-muted-foreground font-normal">{service.unitLabel}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              disabled={quantity <= 0}
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-lg font-semibold min-w-[2rem] text-center">{quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          {quantity > 0 && (
            <div className="text-right">
              {service.priceModel === 'per_person' && adults > 1 && (
                <p className="text-xs text-muted-foreground font-sans">
                  {adults} guests × ${service.price} × {quantity}
                </p>
              )}
              <p className="text-sm font-semibold font-sans">${lineTotal.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
