import Layout from "@/components/Layout";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Original site images
const HERO_IMG = "https://static.wixstatic.com/media/nsplsh_324c68434476535f377873~mv2_d_2909_3636_s_4_2.jpg/v1/fill/w_1920,h_1080,fp_0.50_0.45,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Christopher%20Kuzman.jpg";
const VILLA_IMG = "https://static.wixstatic.com/media/931f2d_f1a0e72f5299474086741cd4aa31732c~mv2.jpg/v1/fill/w_781,h_743,fp_0.45_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/02BB5CD5-65A9-44D5-8B50-DC13EFD08CAF_JPG.jpg";
const SLEEP_IMG = "https://static.wixstatic.com/media/931f2d_9dfd5ba140c044f68a0e69e9c6b28b27f001.jpg/v1/fill/w_1920,h_900,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/931f2d_9dfd5ba140c044f68a0e69e9c6b28b27f001.jpg";
const UPSTAIRS_IMG = "https://static.wixstatic.com/media/931f2d_fdfb2b93a25844ee8fc314d1d70bb775~mv2.jpg/v1/fill/w_781,h_743,fp_0.41_0.46,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Upstairs_Living.jpg";
const POOL_IMG = "https://static.wixstatic.com/media/931f2d_9a8945107e9746f7a52781200121c8dd~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/91F89BB8-0C97-488E-9A9C-D459A58D6FA7_JPG.jpg";
const DOWNTOWN_IMG = "https://static.wixstatic.com/media/931f2d_40de7a1625a34656a4f59895ea28ee79~mv2.jpg/v1/fill/w_600,h_415,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/guide-to-cabo-san-lucas-1.jpg";
const BEACH_IMG = "https://static.wixstatic.com/media/nsplsh_786172684e704c5348546b~mv2_d_5472_3648_s_4_2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Elizeu%20Dias.jpg";
const CHEF_IMG = "https://static.wixstatic.com/media/nsplsh_6245774a44745047754b55~mv2_d_6000_4000_s_4_2.jpg/v1/fill/w_600,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Elle%20Cosgrave.jpg";

const galleryImages = [
  "https://static.wixstatic.com/media/931f2d_5387c2171e34403caf30dbc99954b3b8~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_5387c2171e34403caf30dbc99954b3b8~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_1e4b229c28504357874282d6a40b1273~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_1e4b229c28504357874282d6a40b1273~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_9f8deb692d234f49b7f3ab5dec387482~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_9f8deb692d234f49b7f3ab5dec387482~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_05120fbe0d194548a1908164413edce3~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_05120fbe0d194548a1908164413edce3~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_c690ab9da472485b8dcf82013e2d474b~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_c690ab9da472485b8dcf82013e2d474b~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_9ba2e736ee48419bac356a041ab655b3~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_9ba2e736ee48419bac356a041ab655b3~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_048480f59d7a4993b6ed59aec1db0d49~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_048480f59d7a4993b6ed59aec1db0d49~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_99fb786e3c174b7697f8b9eb5068ddf1~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_99fb786e3c174b7697f8b9eb5068ddf1~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_6a57502bb14942aea8b805d59f90f1a6~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_6a57502bb14942aea8b805d59f90f1a6~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_bbf80f90d1344cf68c1ee10ab0f9cdad~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_bbf80f90d1344cf68c1ee10ab0f9cdad~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_37d217e6cc684e908831aa4cf449a9b1~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_37d217e6cc684e908831aa4cf449a9b1~mv2.jpg",
  "https://static.wixstatic.com/media/931f2d_b769779de8774850bf3a8889c715ea05~mv2.jpg/v1/fill/w_600,h_450,q_90,enc_avif,quality_auto/931f2d_b769779de8774850bf3a8889c715ea05~mv2.jpg",
];

const features = [
  { title: "Poolside Escape", desc: "Take a refreshing dip in our pool while enjoying the views and sunshine.", img: POOL_IMG },
  { title: "Close to Downtown", desc: "Stay close to the heart of Cabo with just an 11-minute trip to downtown's vibrant scene.", img: DOWNTOWN_IMG },
  { title: "Private Beach", desc: "Enjoy a scenic, walkable path to the beach within our community.", img: BEACH_IMG },
  { title: "Private Chef", desc: "Savor gourmet meals prepared by our expert in-house chef, just for you.", img: CHEF_IMG },
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
            <p className="font-sans text-muted-foreground leading-relaxed mb-8">
              Escape to a luxurious getaway where comfort and style come together. Whether you're unwinding or seeking adventure, our thoughtfully designed spaces provide the perfect home base. Enjoy breathtaking surroundings, a pool, and a jacuzzi, and have an unforgettable stay in the heart of Cabo.
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
              alt="Mecca Destinations villa interior"
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
            Whether you're indulging in lazy mornings wrapped in luxury or embracing the city's vibrant nightlife, your stay should be nothing short of exceptional.
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
