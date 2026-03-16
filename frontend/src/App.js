import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreenWrapper from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import FeaturedWork from "@/components/FeaturedWork";
import Analytics from "@/components/Analytics";
import Process from "@/components/Process";
import ExperimentEngine from "@/components/ExperimentEngine";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/AdminDashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Main Portfolio */}
        <Route
          path="/"
          element={
            <LoadingScreenWrapper>
              <div className="App bg-[#0a0a0f] min-h-screen overflow-x-hidden w-full max-w-[100vw]">
                <CustomCursor />
                <Hero />
                <About />
                <Capabilities />
                <FeaturedWork />
                <Analytics />
                <Process />
                <ExperimentEngine />
                <Contact />
                <Footer />
                <Toaster />
              </div>
            </LoadingScreenWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
