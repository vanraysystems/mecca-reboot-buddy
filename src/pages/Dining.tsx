import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CHEF_IMG = "https://static.wixstatic.com/media/nsplsh_6245774a44745047754b55~mv2_d_6000_4000_s_4_2.jpg/v1/fill/w_800,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Elle%20Cosgrave.jpg";
const DINING_HERO = "https://static.wixstatic.com/media/931f2d_9dfd5ba140c044f68a0e69e9c6b28b27f001.jpg/v1/fill/w_1920,h_900,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/931f2d_9dfd5ba140c044f68a0e69e9c6b28b27f001.jpg";
const TABLE_IMG = "https://static.wixstatic.com/media/931f2d_fdfb2b93a25844ee8fc314d1d70bb775~mv2.jpg/v1/fill/w_800,h_600,fp_0.41_0.46,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Upstairs_Living.jpg";

const menuHighlights = [
  {
    title: "Breakfast",
    desc: "Start your day with freshly prepared eggs, tropical fruits, artisan breads, and locally roasted coffee.",
  },
  {
    title: "Lunch",
    desc: "Light and refreshing poolside fare — ceviche, grilled seafood tacos, and fresh salads with local produce.",
  },
  {
    title: "Dinner",
    desc: "An elegant multi-course experience featuring the freshest catch, premium cuts, and handcrafted desserts.",
  },
  {
    title: "Cocktails",
    desc: "Expertly crafted cocktails, fine wines, and artisanal mezcal tastings — served wherever you prefer.",
  },
];

const Dining = () => {
  const navigate = useNavigate();

  const scrollToBooking = () => {
    navigate("/#booking");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${DINING_HERO})` }}
        >
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="relative z-10 text-center text-background px-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            In-House Dining
          </h1>
          <p className="text-xl font-sans font-light opacity-90 max-w-2xl mx-auto">
            A private culinary journey crafted just for you
          </p>
        </div>
      </section>

      {/* About the Experience */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Your Private Chef Experience
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed mb-4">
              At Mecca Destinations, dining is more than a meal — it's an experience. Our dedicated private chef 
              crafts every dish using the freshest local ingredients, tailored to your preferences and dietary needs.
            </p>
            <p className="font-sans text-muted-foreground leading-relaxed mb-8">
              From an intimate breakfast on your terrace to a candlelit dinner by the pool, every meal is a 
              celebration of Baja California's rich culinary heritage fused with international flair.
            </p>
            <Button
              onClick={scrollToBooking}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wider px-8"
            >
              Inquire About Dining
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={CHEF_IMG}
              alt="Private chef preparing a gourmet meal"
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">Menu Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menuHighlights.map((item) => (
              <div key={item.title} className="bg-background rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-serif font-semibold mb-3">{item.title}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Atmosphere */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl md:order-1">
            <img
              src={TABLE_IMG}
              alt="Elegant living and dining space"
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </div>
          <div className="md:order-2">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Set the Scene
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed mb-8">
              Whether it's a romantic dinner for two under the stars, a family brunch by the pool, 
              or a lively cocktail party on the terrace — our team transforms any space into your perfect 
              dining venue. Just tell us your vision, and we'll bring it to life.
            </p>
            <Button
              onClick={scrollToBooking}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans uppercase tracking-wider px-8"
            >
              Plan Your Experience
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dining;
