import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Join the Conversation */}
      <div className="text-center py-16 px-6">
        <h3 className="text-2xl md:text-3xl font-serif mb-4">Join the Conversation</h3>
        <p className="font-sans text-sm opacity-80 mb-6 max-w-md mx-auto">
          Follow us on Instagram for the latest updates, stunning views, and exclusive offers.
        </p>
        <a
          href="https://www.instagram.com/meccadestinations/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-sans uppercase tracking-wide opacity-80 hover:opacity-100 transition-opacity"
        >
          <Instagram size={20} />
          @meccadestinations
        </a>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-foreground/20 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <Link to="/" className="text-2xl font-serif font-bold tracking-wider">
            M
          </Link>

          <div className="flex gap-12 text-xs font-sans">
            <div className="space-y-2">
              <p className="uppercase tracking-wider opacity-50 mb-2">Navigate</p>
              <Link to="/" className="block opacity-70 hover:opacity-100">Home</Link>
              <Link to="/rooms" className="block opacity-70 hover:opacity-100">Rooms</Link>
              <Link to="/dining" className="block opacity-70 hover:opacity-100">In-House Dining</Link>
            </div>
            <div className="space-y-2">
              <p className="uppercase tracking-wider opacity-50 mb-2">Concierge</p>
              <Link to="/book" className="block opacity-70 hover:opacity-100">Book Direct</Link>
              <Link to="/intake" className="block opacity-70 hover:opacity-100">Guest Intake</Link>
              <Link to="/order" className="block opacity-70 hover:opacity-100">In-Villa Orders</Link>
            </div>
          </div>

          <p className="text-xs font-sans opacity-50">
            © {new Date().getFullYear()} Mecca Destinations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
