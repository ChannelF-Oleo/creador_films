import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import Services from "@/components/Services";
import Planes from "@/components/Planes";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Statement />
      <Services />
      <Planes />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
