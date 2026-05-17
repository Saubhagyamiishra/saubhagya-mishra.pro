import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from '@phosphor-icons/react';
import { projectsData } from '@/data/projects';

// Visual Components for each project type
const WaveformVisual = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-bg to-bg-2 flex items-center justify-center overflow-hidden">
    <svg className="w-full h-32" viewBox="0 0 200 60" preserveAspectRatio="none">
      {[...Array(7)].map((_, i) => (
        <motion.path
          key={i}
          d={`M${i * 30},30 Q${i * 30 + 10},${20 + Math.random() * 20} ${i * 30 + 20},30 T${(i + 1) * 30},30`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
        />
      ))}
    </svg>
  </div>
);

const QuoteVisual = ({ text, footer }) => (
  <div className="absolute inset-0 bg-ink flex flex-col items-center justify-center p-8 text-center">
    <p className="font-fraunces text-3xl lg:text-4xl font-light text-paper leading-tight mb-8">
      {text}
    </p>
    <div className="label-mono text-muted text-[9px] flex items-center gap-2">
      <span>{footer.split(' / ')[0]}</span>
      <span className="w-px h-3 bg-muted/30" />
      <span>{footer.split(' / ')[1]}</span>
    </div>
  </div>
);

const GradientTextVisual = ({ text }) => (
  <div className="absolute inset-0 bg-ink flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          var(--accent) 10px,
          var(--accent) 20px
        )`,
      }}
    />
    <h3 className="font-instrument italic text-7xl lg:text-8xl bg-gradient-to-br from-paper to-muted bg-clip-text text-transparent">
      {text}
    </h3>
  </div>
);

const MountainVisual = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-green/30 to-ink flex items-center justify-center overflow-hidden">
    <div
      className="w-full h-32"
      style={{
        backgroundImage: `repeating-linear-gradient(
          120deg,
          transparent 0px,
          transparent 20px,
          rgba(15,14,13,0.8) 20px,
          rgba(15,14,13,0.8) 40px
        )`,
        clipPath: 'polygon(0% 100%, 10% 60%, 25% 75%, 40% 40%, 55% 65%, 70% 35%, 85% 55%, 100% 30%, 100% 100%)',
      }}
    />
    <p className="absolute bottom-8 font-instrument italic text-2xl text-paper/80">
      The Hollow Vale / CHAPTER I
    </p>
  </div>
);

const ConicVisual = () => (
  <div className="absolute inset-0 bg-paper flex items-center justify-center overflow-hidden">
    <div
      className="w-96 h-96"
      style={{
        background: `repeating-conic-gradient(
          from 0deg,
          var(--accent) 0deg 30deg,
          var(--accent-2) 30deg 60deg
        )`,
        maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
      }}
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <p className="font-instrument italic text-3xl text-ink mb-2">Next experiment</p>
      <p className="label-mono text-muted text-[10px]">/ Coming soon /</p>
    </div>
  </div>
);

const ProjectCard = ({ project, onClick }) => {
  const cardRef = useRef(null);
  const [transforms, setTransforms] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransforms({
      rotateY: x * 4,
      rotateX: -y * 4,
      scale: 1.02,
    });
  };

  const handleMouseLeave = () => {
    setTransforms({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${project.gridSpan} group cursor-pointer`}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative bg-paper rounded-3xl border border-line hover:border-line-strong overflow-hidden shadow-soft transition-all duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateY(-6px) rotateY(${transforms.rotateY}deg) rotateX(${transforms.rotateX}deg) scale(${transforms.scale})`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Visual Area */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {project.visual === 'waveform' && <WaveformVisual />}
          {project.visual === 'quote' && (
            <QuoteVisual text={project.quoteText} footer={project.quoteFooter} />
          )}
          {project.visual === 'gradient-text' && <GradientTextVisual text={project.gradientText} />}
          {project.visual === 'mountain' && <MountainVisual />}
          {project.visual === 'conic' && <ConicVisual />}
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Category & Year */}
          <div className="flex items-center gap-3 mb-4">
            <span className="label-mono text-muted text-[10px]">{project.category}</span>
            <span className="w-px h-3 bg-line-strong" />
            <span className="label-mono text-muted text-[10px]">{project.year}</span>
          </div>

          {/* Name */}
          <h3 className="font-fraunces text-3xl lg:text-4xl font-medium text-ink mb-3 leading-tight">
            <span className="font-instrument italic">{project.nameItalic}</span>
            {project.subtitle && <span className="font-normal">{project.subtitle}</span>}
          </h3>

          {/* Description */}
          <p className="text-ink-2 text-sm lg:text-base leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="label-mono text-[10px] px-3 py-1 rounded-full bg-ink/5 text-ink"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="btn-pill bg-ink text-paper text-sm hover:bg-accent group flex items-center gap-2">
              <span>View Details</span>
              <ArrowUpRight weight="bold" className="w-4 h-4" />
            </button>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-pill bg-bg-2 text-ink text-sm hover:border-accent border border-line-strong flex items-center gap-2"
              >
                <span>Visit Site</span>
                <ArrowUpRight weight="bold" className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-paper rounded-3xl p-8 lg:p-12 shadow-soft scrollbar-hide"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-bg hover:bg-accent hover:text-paper flex items-center justify-center transition-all hover:rotate-90"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="space-y-8">
            {/* Category */}
            <div className="label-mono text-accent text-[11px]">{project.category}</div>

            {/* Title */}
            <h2 className="font-fraunces text-4xl lg:text-5xl font-light text-ink leading-tight">
              <span className="font-instrument italic">{project.nameItalic}</span>
              {project.subtitle && <span>{project.subtitle}</span>}
            </h2>

            {/* Subtitle */}
            <p className="text-xl text-ink-2">{project.description}</p>

            <div className="h-px bg-line" />

            {/* Role */}
            <div>
              <h4 className="font-fraunces text-xl font-medium text-ink mb-3">Role</h4>
              <p className="text-ink-2 leading-relaxed">{project.role}</p>
            </div>

            {/* Challenge */}
            <div>
              <h4 className="font-fraunces text-xl font-medium text-ink mb-3">The Challenge</h4>
              <p className="text-ink-2 leading-relaxed">{project.challenge}</p>
            </div>

            {/* Solution */}
            <div>
              <h4 className="font-fraunces text-xl font-medium text-ink mb-3">The Solution</h4>
              <p className="text-ink-2 leading-relaxed">{project.solution}</p>
            </div>

            {/* Stack */}
            <div>
              <h4 className="font-fraunces text-xl font-medium text-ink mb-3">Stack & Tools</h4>
              <p className="label-mono text-ink text-xs">{project.stack}</p>
            </div>

            {/* Results */}
            <div>
              <h4 className="font-fraunces text-xl font-medium text-ink mb-4">Results</h4>
              <div className="grid grid-cols-3 gap-4">
                {project.results.map((result, i) => (
                  <div key={i} className="p-4 bg-bg rounded-xl border border-line">
                    <div className="font-fraunces text-3xl font-medium text-accent mb-1">
                      {result.value}
                    </div>
                    <div className="label-mono text-muted text-[10px]">{result.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-pill bg-gradient-to-r from-accent to-accent-2 text-paper hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 transition-all text-lg font-medium"
              >
                <span>Visit Live Site</span>
                <ArrowUpRight weight="bold" className="w-5 h-5" />
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="work" className="relative py-32 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-muted mb-6"
        >
          Selected Work · 2023 - 2026
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-ink max-w-4xl mb-16"
        >
          A few systems I've built, shipped, and scaled.
        </motion.h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};
