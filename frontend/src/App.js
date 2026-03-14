import "@/App.css";
import LoadingScreenWrapper from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import FeaturedWork from "@/components/FeaturedWork";
import Analytics from "@/components/Analytics";
import Process from "@/components/Process";
import Lab from "@/components/Lab";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <LoadingScreenWrapper>
      <div className="App bg-[#0a0a0f] min-h-screen">
        <CustomCursor />
        <Hero />
        <About />
        <Capabilities />
        <FeaturedWork />
        <Analytics />
        <Process />
        <Lab />
        <Contact />
        <Footer />
        <Toaster />
      </div>
    </LoadingScreenWrapper>
  );
}

export default App;
