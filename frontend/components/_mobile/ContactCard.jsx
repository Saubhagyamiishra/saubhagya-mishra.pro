"use client";

import { motion } from "framer-motion";
import { Envelope, LinkedinLogo, GithubLogo, ArrowUpRight } from "@phosphor-icons/react";

const EMAIL = "saubhagyamiishra@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/saubhagya-mishra-16867718b/";
const GITHUB = "https://github.com/Saubhagyamiishra";

const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Let's build something"
)}&body=${encodeURIComponent(
  "Hi Saubhagya,\n\nI saw your portfolio and would love to chat about...\n\n"
)}`;

export const ContactCard = () => {
  return (
    <section
      id="contact"
      className="relative py-24 bg-ink text-paper overflow-hidden"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-24 -right-12 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,90,31,0.22), transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-paper/50 mb-5"
        >
          Contact · Let&apos;s talk
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-fraunces text-4xl sm:text-5xl font-light leading-tight tracking-tight mb-4"
        >
          Got something{" "}
          <span className="italic text-accent">interesting</span>{" "}
          in mind?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-paper/70 text-base sm:text-lg leading-relaxed max-w-xl mb-10"
        >
          The fastest way to reach me is email. I reply within 48 hours, often
          much sooner. Tap a button below to get the conversation started.
        </motion.p>

        <div className="grid gap-3 sm:gap-4">
          {/* Email — primary CTA */}
          <motion.a
            href={MAILTO}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative flex items-center gap-4 p-5 rounded-2xl bg-accent text-paper hover:brightness-110 transition-all shadow-soft"
            data-testid="contact-email"
          >
            <span className="inline-flex w-10 h-10 rounded-xl bg-paper/15 items-center justify-center shrink-0">
              <Envelope size={20} weight="bold" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block label-mono text-[10px] text-paper/70">
                Email · Fastest
              </span>
              <span className="block font-mono text-sm sm:text-base truncate">
                {EMAIL}
              </span>
            </span>
            <ArrowUpRight
              size={18}
              weight="bold"
              className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="group relative flex items-center gap-4 p-5 rounded-2xl bg-paper/[0.04] border border-paper/10 hover:border-accent/40 hover:bg-paper/[0.07] transition-all"
            data-testid="contact-linkedin"
          >
            <span className="inline-flex w-10 h-10 rounded-xl bg-paper/8 border border-paper/10 items-center justify-center shrink-0">
              <LinkedinLogo size={20} weight="bold" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block label-mono text-[10px] text-paper/45">
                LinkedIn
              </span>
              <span className="block text-sm sm:text-base text-paper/90">
                Saubhagya Mishra
              </span>
            </span>
            <ArrowUpRight
              size={18}
              weight="bold"
              className="shrink-0 text-paper/40 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </motion.a>

          {/* GitHub */}
          <motion.a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.29 }}
            className="group relative flex items-center gap-4 p-5 rounded-2xl bg-paper/[0.04] border border-paper/10 hover:border-accent/40 hover:bg-paper/[0.07] transition-all"
            data-testid="contact-github"
          >
            <span className="inline-flex w-10 h-10 rounded-xl bg-paper/8 border border-paper/10 items-center justify-center shrink-0">
              <GithubLogo size={20} weight="bold" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block label-mono text-[10px] text-paper/45">
                GitHub
              </span>
              <span className="block text-sm sm:text-base text-paper/90">
                Saubhagyamiishra
              </span>
            </span>
            <ArrowUpRight
              size={18}
              weight="bold"
              className="shrink-0 text-paper/40 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </motion.a>
        </div>

        <p className="mt-8 label-mono text-[10px] text-paper/35">
          Marketer · Builder · Automation enthusiast
        </p>
      </div>
    </section>
  );
};
