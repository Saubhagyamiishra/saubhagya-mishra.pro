import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import {
  Envelope,
  LinkedinLogo,
  MapPin,
  ArrowRight,
  Check,
  Upload,
  X,
} from '@phosphor-icons/react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    type: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (files) => {
    for (const file of Array.from(files)) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      try {
        const response = await axios.post(`${API}/contact/upload`, uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.success) {
          setUploadedFiles((prev) => [
            ...prev,
            { name: file.name, path: response.data.file_path, type: file.type, size: file.size },
          ]);
        }
      } catch (error) {
        console.error('File upload failed:', error);
        toast({
          title: 'Upload Failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
      }
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('project_type', formData.type);
      submitData.append('complexity', formData.budget);
      submitData.append('technologies', JSON.stringify([]));
      submitData.append('timeline', formData.timeline);
      submitData.append('files', JSON.stringify(uploadedFiles.map((f) => f.path)));

      const response = await axios.post(`${API}/contact`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            company: '',
            type: '',
            budget: '',
            timeline: '',
            message: '',
          });
          setUploadedFiles([]);
          setShowSuccess(false);
        }, 3500);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Info */}
          <div className="space-y-8">
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="label-mono text-muted"
            >
              Contact · Work With Me
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-fraunces text-5xl lg:text-7xl font-light leading-[0.96] tracking-tight text-ink"
            >
              Have an idea? Let's build it.
            </motion.h2>

            {/* Intro */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-ink-2 leading-relaxed max-w-xl"
            >
              Got a brand, website, app, dashboard, or automation system you want to bring to
              life - or rebuild from scratch? Tell me what you're working on. I read every
              message.
            </motion.p>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <a
                href="mailto:hello@saubhagyamishra.com"
                className="group flex items-center gap-4 p-4 bg-paper rounded-2xl border border-line hover:border-accent hover:translate-x-2 transition-all duration-300"
              >
                <Envelope weight="duotone" className="w-6 h-6 text-ink" />
                <div>
                  <div className="label-mono text-muted text-[10px] mb-1">Email</div>
                  <div className="text-ink font-medium">hello@saubhagyamishra.com</div>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/saubhagyamishra"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-paper rounded-2xl border border-line hover:border-accent hover:translate-x-2 transition-all duration-300"
              >
                <LinkedinLogo weight="duotone" className="w-6 h-6 text-ink" />
                <div>
                  <div className="label-mono text-muted text-[10px] mb-1">LinkedIn</div>
                  <div className="text-ink font-medium">/in/saubhagyamishra</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-paper rounded-2xl border border-line">
                <MapPin weight="duotone" className="w-6 h-6 text-ink" />
                <div>
                  <div className="label-mono text-muted text-[10px] mb-1">Currently</div>
                  <div className="text-ink font-medium">Director, Digital Marketing · Mirsonics</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative bg-paper rounded-3xl p-8 lg:p-10 border border-line shadow-soft"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-paper/95 backdrop-blur-sm rounded-3xl"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green/10 flex items-center justify-center">
                      <Check weight="bold" className="w-10 h-10 text-green" />
                    </div>
                    <h3 className="font-fraunces text-3xl font-medium text-ink mb-2">
                      Message sent!
                    </h3>
                    <p className="text-ink-2">I'll get back to you soon.</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-mono text-muted text-[10px] mb-2 block">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-line focus:border-accent focus:ring-4 focus:ring-accent-glow outline-none transition-all text-ink"
                  />
                </div>
                <div>
                  <label className="label-mono text-muted text-[10px] mb-2 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-line focus:border-accent focus:ring-4 focus:ring-accent-glow outline-none transition-all text-ink"
                  />
                </div>
              </div>

              {/* Row 2: Company + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-mono text-muted text-[10px] mb-2 block">
                    Company/Project
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-line focus:border-accent focus:ring-4 focus:ring-accent-glow outline-none transition-all text-ink"
                  />
                </div>
                <div>
                  <label className="label-mono text-muted text-[10px] mb-2 block">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-line focus:border-accent focus:ring-4 focus:ring-accent-glow outline-none transition-all text-ink cursor-pointer"
                  >
                    <option value="">Select...</option>
                    <option value="Website">Website</option>
                    <option value="Web App">Web App</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Automation">Automation</option>
                    <option value="Brand">Brand</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Budget + Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-mono text-muted text-[10px] mb-2 block">Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-line focus:border-accent focus:ring-4 focus:ring-accent-glow outline-none transition-all text-ink cursor-pointer"
                  >
                    <option value="">Select...</option>
                    <option value="<$5K">&lt;$5K</option>
                    <option value="$5–15K">$5–15K</option>
                    <option value="$15–50K">$15–50K</option>
                    <option value="$50K+">$50K+</option>
                    <option value="Let's talk">Let's talk</option>
                  </select>
                </div>
                <div>
                  <label className="label-mono text-muted text-[10px] mb-2 block">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-line focus:border-accent focus:ring-4 focus:ring-accent-glow outline-none transition-all text-ink cursor-pointer"
                  >
                    <option value="">Select...</option>
                    <option value="ASAP">ASAP</option>
                    <option value="1–3 mo">1–3 mo</option>
                    <option value="3–6 mo">3–6 mo</option>
                    <option value="Exploring">Exploring</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="label-mono text-muted text-[10px] mb-2 block">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-bg rounded-xl border border-line focus:border-accent focus:ring-4 focus:ring-accent-glow outline-none transition-all text-ink resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="label-mono text-muted text-[10px] mb-2 block">
                  Attachments (optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 bg-bg rounded-xl border border-line hover:border-accent transition-all flex items-center justify-center gap-2 text-ink-2 hover:text-ink"
                >
                  <Upload weight="bold" className="w-4 h-4" />
                  <span className="text-sm">Upload files</span>
                </button>
                
                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${file.size}-${index}`}
                        className="flex items-center justify-between p-2 bg-bg rounded-lg border border-line"
                      >
                        <span className="text-xs text-ink-2 truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-muted hover:text-accent transition-colors"
                        >
                          <X weight="bold" className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full btn-pill bg-ink text-paper hover:bg-gradient-to-r hover:from-accent hover:to-accent-2 group flex items-center justify-center gap-2 text-lg font-medium shadow-soft overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Sending...' : 'Start a Project'}</span>
                <ArrowRight
                  weight="bold"
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
