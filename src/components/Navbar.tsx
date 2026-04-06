import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/rooms" },
    { label: "In-House Dining", to: "/dining" },
  ];

  const conciergeLinks = [
    { label: "Book Direct", to: "/book" },
    { label: "Already Booked?", to: "/intake" },
    { label: "In-Villa Orders", to: "/order" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-3xl font-serif font-bold tracking-wider">
          M
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-sans tracking-wide uppercase transition-opacity hover:opacity-80 ${
                location.pathname === link.to ? "opacity-100" : "opacity-70"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Concierge Dropdown */}
          <div className="relative">
            <button
              className="text-sm font-sans tracking-wide uppercase opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
              onClick={() => setConciergeOpen(!conciergeOpen)}
              onBlur={() => setTimeout(() => setConciergeOpen(false), 200)}
            >
              Concierge <ChevronDown className="h-3 w-3" />
            </button>
            {conciergeOpen && (
              <div className="absolute top-full right-0 mt-2 bg-primary border border-primary-foreground/20 rounded-xl shadow-lg py-2 min-w-[180px] z-50">
                {conciergeLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 text-sm font-sans opacity-80 hover:opacity-100 hover:bg-primary-foreground/10 transition-all"
                    onClick={() => setConciergeOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book Now CTA */}
        <div className="hidden md:block">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary font-sans text-sm tracking-wide uppercase"
          >
            <Link to="/book">Book Now</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary px-6 pb-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-sans tracking-wide uppercase opacity-90 hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-primary-foreground/20 pt-3 space-y-3">
            <p className="text-xs font-sans uppercase tracking-wider opacity-50">Concierge</p>
            {conciergeLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-sans tracking-wide uppercase opacity-90 hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary font-sans text-sm tracking-wide uppercase w-full"
          >
            <Link to="/book" onClick={() => setMobileOpen(false)}>Book Now</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
