import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#careers", label: "Careers" },
  { href: "#blog", label: "Blog" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b" : "border-b border-transparent"}`}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display font-bold text-xl tracking-tight">
          <span className="text-gradient">NEXIGEN</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="relative text-foreground/80 hover:text-foreground transition-colors group">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-brand transition-all duration-300" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium bg-gradient-brand text-primary-foreground hover:scale-[1.03] hover:shadow-[0_0_30px_-6px_rgba(124,196,232,0.6)] transition-all">
          Start a Project <ArrowRight className="h-4 w-4" />
        </a>
        <button aria-label="Menu" onClick={() => setOpen(true)} className="md:hidden p-2 rounded-md glass">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85%] glass-strong border-l p-6 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-bold text-gradient">NEXIGEN</span>
            <button aria-label="Close" onClick={() => setOpen(false)} className="p-2"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg py-2 hover:text-primary transition-colors">{l.label}</a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium bg-gradient-brand text-primary-foreground">
              Start a Project <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
