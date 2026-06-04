import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saubhagya Mishra",
  description:
    "Saubhagya Mishra. Director of Digital Marketing, builder, and automation enthusiast. Marketing, analytics and AI, wired into one signal.",
  authors: [{ name: "Saubhagya Mishra" }],
  openGraph: {
    title: "Saubhagya Mishra",
    description:
      "Builder, marketer, automation enthusiast. Marketing, analytics and AI in one signal.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Display: Bricolage Grotesque · Accent serif: Instrument Serif · Mono: Space Mono · Body: Sora */}
        {/* Mobile portfolio fonts: Fraunces (display) · Geist (body) · Geist Mono (labels) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=Sora:wght@300;400;500;600&family=Space+Mono:wght@400;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* ────────────────────────────────────────────────────────────
            Mobile boot splash — first-paint, no JS bundle dependency.
            Renders an inline overlay that covers the layout while the
            client bundle hydrates. Disabled on >=1024px viewports.
            ──────────────────────────────────────────────────────────── */}
        <style
          id="boot-css"
          dangerouslySetInnerHTML={{
            __html: `
              #boot { display: none; }
              @media (max-width: 1023px) {
                #boot {
                  position: fixed;
                  inset: 0;
                  z-index: 9999;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #f4f1ea;
                  color: #0f0e0d;
                  font-family: 'Geist', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                  -webkit-font-smoothing: antialiased;
                  transition: opacity 0.55s ease;
                }
                #boot .boot-inner {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 26px;
                  padding: 24px;
                  max-width: 320px;
                }
                #boot .boot-monogram {
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #0f0e0d;
                  color: #fbf9f4;
                  font-family: 'Fraunces', Georgia, serif;
                  font-size: 20px;
                  font-weight: 500;
                  letter-spacing: 0.04em;
                  box-shadow: 0 1px 2px rgba(15,14,13,0.08), 0 20px 60px rgba(15,14,13,0.10);
                }
                #boot .boot-msg {
                  font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
                  font-size: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.22em;
                  color: #6a655d;
                  min-height: 1.2em;
                  text-align: center;
                  transition: opacity 0.28s ease;
                }
                #boot .boot-bar {
                  width: 180px;
                  height: 2px;
                  background: rgba(26,24,22,0.08);
                  overflow: hidden;
                  border-radius: 1px;
                  position: relative;
                }
                #boot .boot-bar span {
                  position: absolute;
                  inset: 0 auto 0 0;
                  width: 40%;
                  background: linear-gradient(90deg, #ff5a1f, #ffb547);
                  border-radius: 1px;
                  animation: boot-progress 1.4s cubic-bezier(0.4,0,0.2,1) infinite;
                }
                @keyframes boot-progress {
                  0%   { transform: translateX(-110%); }
                  100% { transform: translateX(360%); }
                }
                @media (prefers-reduced-motion: reduce) {
                  #boot .boot-bar span {
                    animation: none;
                    width: 100%;
                    opacity: 0.55;
                  }
                  #boot { transition: none; }
                }
                html.app-ready #boot {
                  opacity: 0;
                  pointer-events: none;
                }
              }
            `,
          }}
        />
        <script
          id="boot-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if (typeof window === 'undefined') return;
                try {
                  if (!window.matchMedia('(max-width: 1023px)').matches) return;
                } catch (e) { return; }
                var MIN = 800, MAX = 7000;
                var start = Date.now();
                var revealed = false;
                var msgs = [
                  'Wiring the signal…',
                  'Caffeinating pixels…',
                  'Compiling stories…',
                  'Tuning the antenna…',
                  'Polishing the edges…'
                ];
                var i = 0;
                function rotate(){
                  var el = document.getElementById('boot-msg');
                  if (!el) return;
                  i = (i + 1) % msgs.length;
                  el.style.opacity = '0';
                  setTimeout(function(){
                    el.textContent = msgs[i];
                    el.style.opacity = '1';
                  }, 260);
                }
                var rotId = setInterval(rotate, 1400);
                function reveal(){
                  if (revealed) return;
                  revealed = true;
                  var wait = Math.max(0, MIN - (Date.now() - start));
                  setTimeout(function(){
                    clearInterval(rotId);
                    document.documentElement.classList.add('app-ready');
                    setTimeout(function(){
                      var b = document.getElementById('boot');
                      if (b && b.parentNode) b.parentNode.removeChild(b);
                    }, 650);
                  }, wait);
                }
                window.addEventListener('app-ready', reveal);
                window.addEventListener('load', reveal);
                setTimeout(reveal, MAX);
              })();
            `,
          }}
        />
      </head>
      <body>
        {/* First-paint boot splash — hidden by CSS on desktop */}
        <div id="boot" aria-hidden="true" role="status">
          <div className="boot-inner">
            <div className="boot-monogram">SM</div>
            <div className="boot-msg" id="boot-msg">
              Wiring the signal…
            </div>
            <div className="boot-bar">
              <span />
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
