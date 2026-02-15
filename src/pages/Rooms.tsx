import Layout from "@/components/Layout";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const cozyImages = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d3b62c3ec?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
];

const suiteImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
];

const penthouseImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
];

const rooms = [
  {
    name: "The Cozy Retreat",
    description:
      "A warm and inviting space designed for ultimate relaxation. Wake up to ocean views, unwind on your private terrace, and enjoy the comforts of modern luxury in an intimate setting.",
    features: ["Private Terrace", "Modern Bath", "Smart Entertainment", "Ocean View"],
    images: cozyImages,
  },
  {
    name: "The Grand Suite",
    description:
      "Spacious and elegant, the Grand Suite offers a separate living area, premium bedding, and floor-to-ceiling windows that flood the room with natural light and breathtaking vistas.",
    features: ["King Bed", "Living Area", "Rainfall Shower", "Minibar"],
    images: suiteImages,
  },
  {
    name: "The Penthouse",
    description:
      "Our crown jewel. The Penthouse spans the entire top floor with a private plunge pool, wraparound terrace, and panoramic views of the Sea of Cortez. Pure indulgence.",
    features: ["Private Pool", "Wraparound Terrace", "Butler Service", "Panoramic Views"],
    images: penthouseImages,
  },
];

const Rooms = () => {
  const navigate = useNavigate();

  const scrollToBooking = () => {
    navigate("/#booking");
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-accent py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-accent-foreground mb-4">
          Stay Your Way
        </h1>
        <p className="text-lg font-sans text-accent-foreground/80 max-w-2xl mx-auto">
          Every room is designed to offer a unique blend of comfort, style, and unforgettable views.
        </p>
      </section>

      {/* Room Sections */}
      {rooms.map((room, i) => (
        <section
          key={room.name}
          className={`py-20 px-6 ${i % 2 === 1 ? "bg-secondary/30" : ""}`}
        >
          <div
            className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
              i % 2 === 1 ? "md:direction-rtl" : ""
            }`}
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">{room.name}</h2>
              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                {room.description}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {room.features.map((f) => (
                  <span
                    key={f}
                    className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-sans"
                  >
                    {f}
                  </span>
                ))}
              </div>
              <Button
                onClick={scrollToBooking}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wider px-8"
              >
                Book Your Stay
              </Button>
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <ImageCarousel images={room.images} alt={room.name} className="h-[400px]" />
            </div>
          </div>
        </section>
      ))}
    </Layout>
  );
};

export default Rooms;
