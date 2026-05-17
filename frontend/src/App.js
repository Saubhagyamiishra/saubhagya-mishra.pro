import "@/App.css";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// New MVP Components
import { Navigation } from "@/components/new/Navigation";
import { Hero } from "@/components/new/Hero";
import { About } from "@/components/new/About";
import { Projects } from "@/components/new/Projects";
import { Contact } from "@/components/new/Contact";
import { Footer } from "@/components/new/Footer";

// Preserve existing Admin Dashboard
import AdminDashboard from "@/components/AdminDashboard";

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Projects />
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
