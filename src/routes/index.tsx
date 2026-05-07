import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Hero, Marquee, Services, Process, Stats, Work, TechStack, Testimonials, About, Certs, Careers, Blog, Contact, Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Stats />
        <Work />
        <TechStack />
        <Testimonials />
        <About />
        <Certs />
        <Careers />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
