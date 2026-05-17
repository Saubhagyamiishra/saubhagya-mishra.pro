import "@/App.css";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// New Components
import { Navigation } from "@/components/new/Navigation";
import { Hero } from "@/components/new/Hero";
import { InfiniteMarquee } from "@/components/new/Marquee";
import { About } from "@/components/new/About";
import { Capabilities } from "@/components/new/Capabilities";
import { Projects } from "@/components/new/Projects";
import { ResultsDashboard } from "@/components/new/ResultsDashboard";
import { ProcessTimeline } from "@/components/new/ProcessTimeline";
import { TheLab } from "@/components/new/TheLab";
import { Testimonials } from "@/components/new/Testimonials";
import { Contact } from "@/components/new/Contact";
import { Footer } from "@/components/new/Footer";

// Preserve existing Admin Dashboard
import AdminDashboard from "@/components/AdminDashboard";

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <InfiniteMarquee />
      <About />
      <Capabilities />
      <Projects />
      <ResultsDashboard />
      <ProcessTimeline />
      <TheLab />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
