import Layout from "@/components/Layout";
import BookingForm from "@/components/BookingForm";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const heroImage = "https://static.wixstatic.com/media/5b2137_7d1c5d3e8e6a4e8e9c3f3b8e5a7c9d2f~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/cabo-arch.jpg";
const villaInterior = "https://static.wixstatic.com/media/5b2137_villa_interior.jpg/v1/fill/w_800,h_600,al_c,q_80/villa.jpg";

// Using high-quality Cabo/villa placeholder images
const HERO_IMG = "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1920&h=1080&fit=crop";
const VILLA_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop";
const SLEEP_IMG = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=800&fit=crop";
const POOL_IMG = "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop";
const DOWNTOWN_IMG = "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&h=400&fit=crop";
const BEACH_IMG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop";
const CHEF_IMG = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop";

const galleryImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
];

const features = [
  { title: "Poolside Escape", desc: "Relax by our infinity pool with stunning ocean views.", img: POOL_IMG },
  { title: "Close to Downtown", desc: "Just minutes from Cabo's vibrant nightlife and dining.", img: DOWNTOWN_IMG },
  { title: "Private Beach", desc: "Exclusive beach access for an unforgettable retreat.", img: BEACH_IMG },
  { title: "Private Chef", desc: "Savor gourmet meals crafted by our in-house chef.", img: CHEF_IMG },
];

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#booking") {
      setTimeout(() => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        >
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        <div className="relative z-10 text-center text-background px-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 animate-fade-in">
            Escape to Luxury
          </h1>
          <p className="text-xl md:text-2xl font-sans font-light mb-8 opacity-90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Experience Cabo Like Never Before
          </p>
          <Button
            onClick={scrollToBooking}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wider px-8 py-6 text-base animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Book Your Stay
          </Button>
        </div>
      </section>

      {/* Unwind Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Unwind in the Heart of Cabo
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed mb-4">
              Nestled along the stunning coastline of Los Cabos, our exclusive villa offers an unparalleled retreat. 
              With breathtaking ocean views, world-class amenities, and personalized service, every moment is designed 
              to make you feel at home — only better.
            </p>
            <p className="font-sans text-muted-foreground leading-relaxed mb-8">
              Whether you're seeking adventure or tranquility, our villa is the perfect base for your Cabo escape. 
              From sunrise yoga on the terrace to sunset cocktails by the infinity pool, let us curate your dream vacation.
            </p>
            <Button
              onClick={scrollToBooking}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wider px-8"
            >
              Book Your Stay
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={VILLA_IMG}
              alt="Luxury villa interior in Cabo San Lucas"
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Sleeping In Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${SLEEP_IMG})` }}
        >
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="relative z-10 text-center text-background px-6 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            Sleeping In or Staying Up Late
          </h2>
          <p className="text-lg font-sans font-light mb-8 opacity-90">
            The choice is yours. Every detail of your stay is tailored to your rhythm.
          </p>
          <Button
            onClick={scrollToBooking}
            variant="outline"
            className="rounded-full border-background text-background bg-transparent hover:bg-background hover:text-foreground font-sans uppercase tracking-wider px-8"
          >
            Book Your Stay
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            Indulge in Elevated Comfort
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group">
                <div className="rounded-2xl overflow-hidden mb-4 shadow-md">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-serif font-semibold mb-1">{f.title}</h3>
                <p className="text-sm font-sans text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
                <img
                  src={img}
                  alt={`Villa gallery photo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <BookingForm />
    </Layout>
  );
};

export default Index;
