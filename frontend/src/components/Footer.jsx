import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0f] border-t border-gray-800/50 py-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SM
            </span>
          </div>
          
          <p className="text-gray-400 text-sm mb-2">
            Crafted with passion in Boston
          </p>
          
          <p className="text-gray-600 text-xs">
            © {currentYear} Saubhagya Mishra. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;