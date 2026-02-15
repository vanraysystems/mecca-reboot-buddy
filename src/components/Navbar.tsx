import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const scrollToBooking = () => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      window.location.href = "/#booking";
      return;
    }
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/rooms" },
    { label: "In-House Dining", to: "/dining" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
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
        </div>

        {/* Book Now */}
        <div className="hidden md:block">
          <Button
            onClick={scrollToBooking}
            variant="outline"
            className="rounded-full border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary font-sans text-sm tracking-wide uppercase"
          >
            Book Now
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
          <Button
            onClick={scrollToBooking}
            variant="outline"
            className="rounded-full border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary font-sans text-sm tracking-wide uppercase w-full"
          >
            Book Now
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
