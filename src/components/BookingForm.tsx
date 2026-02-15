import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  guests: z.string().min(1, "Number of guests is required"),
  message: z.string().trim().max(1000).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", guests: "", message: "" },
  });

  const onSubmit = (data: BookingFormData) => {
    if (!checkIn || !checkOut) {
      toast({ title: "Please select check-in and check-out dates", variant: "destructive" });
      return;
    }
    toast({
      title: "Booking Request Sent!",
      description: `Thank you ${data.name}, we'll get back to you shortly about your stay from ${format(checkIn, "PPP")} to ${format(checkOut, "PPP")}.`,
    });
    form.reset();
    setCheckIn(undefined);
    setCheckOut(undefined);
  };

  return (
    <section id="booking" className="py-20 px-6 bg-secondary/50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-3">Book Your Stay</h2>
        <p className="text-center font-sans text-muted-foreground mb-10">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" className="rounded-xl bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" className="rounded-xl bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Check-in */}
              <div className="space-y-2">
                <label className="text-sm font-sans font-medium">Check-in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal rounded-xl bg-background", !checkIn && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <label className="text-sm font-sans font-medium">Check-out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal rounded-xl bg-background", !checkOut && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < (checkIn || new Date())}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans">Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="20" placeholder="2" className="rounded-xl bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-sans">Message (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special requests or questions..." className="rounded-xl bg-background min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wide py-6 text-base"
            >
              Send Booking Request
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default BookingForm;
