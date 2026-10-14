import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import Services from "@/components/Services";
import Planes from "@/components/Planes";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getCurrentYear } from "@/lib/year";
import { getLanding } from "@/lib/landing";

export default async function Home() {
  // Fotos elegidas por el fotógrafo desde /portafolio; los textos siguen en translations
  const landing = await getLanding();

  return (
    <main>
      <Navbar />
      <Hero photo={landing.hero} />
      <About photo={landing.about} />
      <Statement />
      <Services editorials={landing.editorials} />
      <Planes />
      <Contact photo={landing.bookings} />
      <Footer year={await getCurrentYear()} />
      <WhatsAppButton />
    </main>
  );
}
