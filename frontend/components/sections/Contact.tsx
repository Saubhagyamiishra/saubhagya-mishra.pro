"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CONTACT } from "@/lib/data";
import Scramble from "@/components/Scramble";

function MagneticButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.32}px)`;
    const label = el.querySelector<HTMLElement>(".cta-label");
    if (label) label.style.transform = `translate(${x * 0.14}px, ${y * 0.16}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0,0)";
    const label = el.querySelector<HTMLElement>(".cta-label");
    if (label) label.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      className="cta"
      href={href}
      data-cursor
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <span className="cta-label">{children}</span>
    </a>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <motion.p
          className="kicker"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
        >
          04 <span className="kicker-dash" /> <Scramble text="Contact" />
        </motion.p>

        <motion.h2
          className="contact-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&apos;s build something <em>extraordinary</em>.
        </motion.h2>

        <motion.p
          className="contact-roles"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          Marketer. Builder. Automation enthusiast. Problem solver.
        </motion.p>

        <motion.div
          className="contact-cta-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <MagneticButton href={`mailto:${CONTACT.email}`}>
            Start a conversation
          </MagneticButton>
          <span className="contact-email">{CONTACT.email}</span>
        </motion.div>

        <div className="contact-socials">
          {CONTACT.socials.map((s) => (
            <a
              key={s.label}
              className="social"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Saubhagya Mishra</span>
        <span className="footer-mid">Designed and built by Saubhagya Mishra</span>
        <span>Signal v1</span>
      </footer>
    </section>
  );
}
