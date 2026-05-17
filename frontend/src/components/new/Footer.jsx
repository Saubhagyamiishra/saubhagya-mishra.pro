import { motion } from 'framer-motion';
import { LinkedinLogo, InstagramLogo, GithubLogo, Envelope, ArrowRight } from '@phosphor-icons/react';

export const Footer = () => {
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
    <footer className="relative bg-ink text-paper pt-20 pb-8 overflow-hidden">
      {/* Mega Watermark */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none">
        <div className="font-fraunces text-[clamp(80px,20vw,280px)] leading-none tracking-tighter text-center opacity-[0.06]">
          <span>Build · </span>
          <span className="font-instrument italic opacity-[0.15] text-accent">Ship</span>
          <span> · Compound</span>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-fraunces text-4xl lg:text-5xl font-light text-paper leading-tight">
              Saubhagya Mishra
            </h3>
            <p className="text-sm text-paper/60 leading-relaxed max-w-xs">
              Digital builder · Creative operator · Analytics thinker. Currently Director of
              Digital Marketing at Mirsonics — building the next category in health-tech.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="label-mono text-paper/40 mb-6">Navigate</h4>
            <nav className="space-y-3">
              {['About', 'Work', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block text-paper/80 hover:text-accent hover:translate-x-1 transition-all duration-200"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="label-mono text-paper/40 mb-6">Connect</h4>
            <nav className="space-y-3">
              <a
                href="https://linkedin.com/in/saubhagyamishra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-paper/80 hover:text-accent hover:translate-x-1 transition-all duration-200"
              >
                <LinkedinLogo weight="fill" className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://instagram.com/saubhagyamishra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-paper/80 hover:text-accent hover:translate-x-1 transition-all duration-200"
              >
                <InstagramLogo weight="fill" className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://github.com/saubhagyamishra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-paper/80 hover:text-accent hover:translate-x-1 transition-all duration-200"
              >
                <GithubLogo weight="fill" className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="mailto:hello@saubhagyamishra.com"
                className="flex items-center gap-2 text-paper/80 hover:text-accent hover:translate-x-1 transition-all duration-200"
              >
                <Envelope weight="fill" className="w-4 h-4" />
                <span>Email</span>
              </a>
            </nav>
          </div>

          {/* Status */}
          <div>
            <h4 className="label-mono text-paper/40 mb-6">Status</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                <span className="text-sm text-paper/80">Taking projects · Q3</span>
              </div>
              <button
                onClick={() => scrollToSection('contact')}
                className="group flex items-center gap-2 text-paper hover:text-accent transition-colors"
              >
                <span>Start a project</span>
                <ArrowRight
                  weight="bold"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-paper/40">
          <div className="flex items-center gap-4">
            <span>© 2026 Saubhagya Mishra</span>
            <span className="hidden sm:inline">·</span>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Designed & built</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
