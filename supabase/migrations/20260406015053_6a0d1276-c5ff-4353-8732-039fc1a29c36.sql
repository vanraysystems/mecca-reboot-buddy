-- Add new columns to bookings table
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'direct_booking',
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS airbnb_confirmation TEXT,
  ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS occasion TEXT,
  ADD COLUMN IF NOT EXISTS dietary_notes TEXT,
  ADD COLUMN IF NOT EXISTS arrival_time TEXT,
  ADD COLUMN IF NOT EXISTS airport_pickup BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS special_requests TEXT,
  ADD COLUMN IF NOT EXISTS services_json JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS estimated_total NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS final_total NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS villa_area TEXT,
  ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gio_briefed_at TIMESTAMPTZ;

-- Add validation trigger for type/source/status
CREATE OR REPLACE FUNCTION public.validate_booking_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type NOT IN ('direct_booking', 'airbnb_intake', 'midstay_order') THEN
    RAISE EXCEPTION 'Invalid booking type: %', NEW.type;
  END IF;
  IF NEW.source IS NOT NULL AND NEW.source NOT IN ('instagram', 'referral', 'airbnb', 'vrbo', 'youtube', 'google', 'level5', 'linkedin', 'other') THEN
    RAISE EXCEPTION 'Invalid source: %', NEW.source;
  END IF;
  IF NEW.status NOT IN ('pending', 'submitted', 'invoiced', 'paid', 'gio_briefed', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS validate_booking_fields ON public.bookings;
CREATE TRIGGER validate_booking_fields
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_type();

-- Update default status
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'submitted';

-- Allow authenticated users to read and update bookings
CREATE POLICY "Service role can read all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);