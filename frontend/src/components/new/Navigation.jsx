import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass rounded-full px-6 py-3 shadow-soft">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-7 h-7 rounded-lg bg-ink overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-2 mix-blend-overlay opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center text-paper text-xs font-fraunces font-semibold">
                  SM
                </div>
              </div>
              <span className="font-fraunces font-medium text-ink text-lg hidden sm:block">
                Saubhagya Mishra
              </span>
            </button>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              {['About', 'Work', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="px-4 py-2 rounded-full text-sm font-medium text-ink-2 hover:text-ink hover:bg-bg-2 transition-all duration-200"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-pill bg-ink text-paper hover:bg-accent group flex items-center gap-2 text-sm"
            >
              <span>Start a Project</span>
              <ArrowRight
                weight="bold"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
