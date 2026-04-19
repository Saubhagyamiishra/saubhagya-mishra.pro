import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, X, Code, Palette, Zap, Monitor } from 'lucide-react';

const FeaturedWork = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Premium website projects - structured for real website showcases
  const websites = [
    {
      id: 1,
      name: 'Mirsonics',
      tagline: 'Premium health-tech platform for modern wellness',
      category: 'Medical SaaS',
      role: 'UX/UI Design & Web Development',
      image: 'https://customer-assets.emergentagent.com/job_saubhagya-nexus/artifacts/tvptjiih_Nano%20Banana%202%20-%20Create%20a%2011%20favicon%20for%20this%20website_%20_Mirsonics%20%281%29.png',
      gradient: 'from-blue-600 to-cyan-500',
      technologies: ['React', 'Health-Tech', 'UI/UX', 'Product Design'],
      description: 'Designed and developed a premium digital health platform that blends modern wellness principles with intelligent user experience. Built with a focus on trust, clarity, and clinical precision, delivering a polished SaaS-style product presentation for the medical sector.',
      highlights: [
        'Clinical-grade interface design',
        'Intelligent health data visualization',
        'HIPAA-compliant architecture',
        'Seamless patient experience'
      ],
      status: 'Live',
      liveUrl: 'https://www.mirsonics.com'
    },
    {
      id: 2,
      name: 'Inn of Joy',
      tagline: 'Modern hotel website with robust admin panel',
      category: 'Hospitality Tech',
      role: 'Full Website & Admin System',
      image: 'https://images.pexels.com/photos/7821345/pexels-photo-7821345.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      gradient: 'from-amber-600 to-orange-500',
      technologies: ['Hotel Website', 'Admin Panel', 'Full Website', 'UX/UI', 'Website Management'],
      description: 'A modern hotel website experience with a robust admin panel for managing content, operations, and the guest-facing digital experience. Built to empower hotel staff with full control over website content, room offerings, media assets, and operational updates while delivering a premium guest-facing booking experience.',
      highlights: [
        'Guest-facing booking website',
        'Robust admin panel for content control',
        'Room & offering management system',
        'Media & asset management',
        'Operational flexibility & updates',
        'Premium hospitality brand experience'
      ],
      status: 'Live',
      liveUrl: 'https://www.innofjoy.com'
    },
    {
      id: 3,
      name: 'E-Commerce Platform',
      tagline: 'Modern shopping experience with seamless checkout',
      category: 'Full Website',
      role: 'Frontend Development & UX',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      gradient: 'from-purple-600 to-cyan-600',
      technologies: ['React', 'Next.js', 'Stripe', 'Tailwind CSS'],
      description: 'Built a high-performance e-commerce platform with optimized product pages, intelligent search, and streamlined checkout flow. Focused on conversion optimization and mobile-first design.',
      highlights: [
        'Lightning-fast page loads (<1s)',
        'Intelligent product filtering',
        'Optimized checkout (45% conversion lift)',
        'Mobile-responsive design'
      ],
      status: 'Live',
      liveUrl: null // Coming Soon
    },
    {
      id: 4,
      name: 'SaaS Landing Page',
      tagline: 'Conversion-focused landing experience',
      category: 'Landing Page',
      role: 'Web Design & Development',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80',
      gradient: 'from-cyan-600 to-blue-600',
      technologies: ['React', 'Framer Motion', 'Analytics', 'SEO'],
      description: 'Designed and developed a high-converting SaaS landing page with strategic CTAs, social proof integration, and performance-optimized animations. Built for maximum user engagement.',
      highlights: [
        'SEO-optimized structure',
        'Animated hero sections',
        'Integrated analytics tracking',
        'A/B tested conversion flows'
      ],
      status: 'Live',
      liveUrl: null // Coming Soon
    },
    {
      id: 5,
      name: 'Portfolio Website',
      tagline: 'Interactive creative showcase',
      category: 'Portfolio Site',
      role: 'Full Stack Development',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80',
      gradient: 'from-violet-600 to-purple-600',
      technologies: ['React', 'Three.js', 'GSAP', 'Node.js'],
      description: 'Created an immersive portfolio experience with 3D elements, smooth animations, and dynamic project showcases. Focused on memorable user experience and visual storytelling.',
      highlights: [
        '3D interactive elements',
        'Smooth scroll animations',
        'Dynamic project filtering',
        'Content management system'
      ],
      status: 'In Development',
      liveUrl: null // Coming Soon
    },
    {
      id: 6,
      name: 'Dashboard Application',
      tagline: 'Real-time analytics and data visualization',
      category: 'Web Application',
      role: 'Frontend Architecture',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      gradient: 'from-emerald-600 to-teal-600',
      technologies: ['React', 'D3.js', 'WebSocket', 'Chart.js'],
      description: 'Built a comprehensive analytics dashboard with real-time data visualization, interactive charts, and customizable widgets. Optimized for performance with large datasets.',
      highlights: [
        'Real-time data updates',
        'Interactive chart system',
        'Custom widget builder',
        'Export & reporting tools'
      ],
      status: 'Live',
      liveUrl: null // Coming Soon
    },
  ];

  return (
    <section id="work" className="relative py-32 bg-[#0a0a0f] overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(6,182,212,0.05),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6"
          >
            <Monitor className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Website Portfolio</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Websites I've Built
            </span>
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Premium digital experiences crafted with attention to design, performance, and user engagement.
          </p>
        </motion.div>

        {/* Premium stacked website showcase */}
        <div className="space-y-8">
          {websites.map((website, index) => (
            <motion.div
              key={website.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Website card */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-gray-800/50 hover:border-purple-500/30 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedProject(website)}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
                  {/* Left: Website preview */}
                  <motion.div 
                    className="w-full lg:w-1/2 relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-500">
                      {/* Image container with zoom effect */}
                      <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={website.image}
                          alt={website.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${website.gradient} opacity-20 mix-blend-overlay`} />
                      
                      {/* Status badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
                          website.status === 'Live' 
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                            : 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        }`}>
                          {website.status}
                        </div>
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${website.gradient} opacity-0 group-hover:opacity-20 blur-2xl -z-10 transition-opacity duration-500`}
                    />
                  </motion.div>

                  {/* Right: Website info */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    {/* Category badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/50 text-xs text-gray-400">
                      <Code className="w-3 h-3" />
                      {website.category}
                    </div>

                    {/* Website name */}
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                        {website.name}
                      </h3>
                      <p className="text-gray-400 text-lg">
                        {website.tagline}
                      </p>
                    </div>

                    {/* Role */}
                    <div className="flex items-center gap-2 text-purple-400">
                      <Palette className="w-4 h-4" />
                      <span className="text-sm font-medium">{website.role}</span>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {website.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-300 hover:border-purple-500/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(website);
                        }}
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </motion.button>

                      {/* Visit Website / Coming Soon button */}
                      {website.liveUrl ? (
                        <motion.a
                          href={website.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="group/visit inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/80 border border-gray-700 hover:border-purple-500/50 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Visit Website</span>
                          <ExternalLink className="w-4 h-4 group-hover/visit:translate-x-1 group-hover/visit:-translate-y-1 transition-transform" />
                        </motion.a>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 font-medium cursor-not-allowed"
                        >
                          <span>Coming Soon</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8 lg:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              {/* Modal content */}
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-sm text-purple-300 mb-4">
                    {selectedProject.category}
                  </div>
                  <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {selectedProject.name}
                  </h3>
                  <p className="text-xl text-gray-300 mb-4">
                    {selectedProject.tagline}
                  </p>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Palette className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedProject.role}</span>
                  </div>
                </div>

                {/* Large preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-700">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${selectedProject.gradient} opacity-20 mix-blend-overlay`} />
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Project Overview</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                      >
                        <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-sm text-white font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visit Website CTA in modal */}
                {selectedProject.liveUrl && (
                  <motion.a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group/cta flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-5 h-5 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedWork;
