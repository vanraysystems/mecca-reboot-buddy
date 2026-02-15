import Layout from "@/components/Layout";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Original site room images
const cozyImages = [
  "https://static.wixstatic.com/media/c837a6_4ea2357e82554663a1c84809cf16ac31~mv2.jpg/v1/fill/w_800,h_600,q_90,enc_avif,quality_auto/c837a6_4ea2357e82554663a1c84809cf16ac31~mv2.jpg",
  "https://static.wixstatic.com/media/c837a6_f932e19d498a4909b64c6d2987916e28~mv2.jpg/v1/fill/w_800,h_600,q_90,enc_avif,quality_auto/c837a6_f932e19d498a4909b64c6d2987916e28~mv2.jpg",
];

const suiteImages = [
  "https://static.wixstatic.com/media/931f2d_714ed4d2cf824698837f17aea9eb9bca~mv2.jpg/v1/fill/w_800,h_800,q_90,enc_avif,quality_auto/931f2d_714ed4d2cf824698837f17aea9eb9bca~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_54ba243d07d443ec9a35e6769c7c01c8~mv2.jpg/v1/fill/w_800,h_800,q_90,enc_avif,quality_auto/931f2d_54ba243d07d443ec9a35e6769c7c01c8~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_ba25e964ca0d4139a260ab9ef630a364~mv2.jpg/v1/fill/w_800,h_800,q_90,enc_avif,quality_auto/931f2d_ba25e964ca0d4139a260ab9ef630a364~mv2.jpg",
];

const penthouseImages = [
  "https://static.wixstatic.com/media/931f2d_b100034d55cf43edb9321f74a0bec8eb~mv2.jpg/v1/fill/w_800,h_800,q_90,enc_avif,quality_auto/931f2d_b100034d55cf43edb9321f74a0bec8eb~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_3f0ddb22c73d4d0287e1a5e1635f9d3a~mv2.jpg/v1/fill/w_800,h_800,q_90,enc_avif,quality_auto/931f2d_3f0ddb22c73d4d0287e1a5e1635f9d3a~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_1ed9b236be8f429ca8226a6801b92130~mv2.jpg/v1/fill/w_800,h_800,q_90,enc_avif,quality_auto/931f2d_1ed9b236be8f429ca8226a6801b92130~mv2.jpg",
];

const rooms = [
  {
    name: "The Cozy Retreat",
    description:
      "Step out to a sun-kissed terrace and let the view set the tone for your day. A warm and inviting space designed for ultimate relaxation with ocean views and modern luxury.",
    features: ["Private Terrace", "Modern Bath", "Smart Entertainment", "Chic Comfort"],
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
          Immerse Yourself in Luxury & Memorable Moments
        </p>
      </section>

      {/* Room Sections */}
      {rooms.map((room, i) => (
        <section
          key={room.name}
          className={`py-20 px-6 ${i % 2 === 1 ? "bg-secondary/30" : ""}`}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
