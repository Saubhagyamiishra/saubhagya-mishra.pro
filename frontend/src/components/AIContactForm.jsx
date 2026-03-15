import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Mail, MapPin, Send, Upload, X, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIContactForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [aiSuggestions, setAiSuggestions] = useState({
    projectType: null,
    complexity: null,
    technologies: [],
    timeline: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMessageFocused, setIsMessageFocused] = useState(false);
  const fileInputRef = useRef(null);

  // AI suggestion options
  const suggestions = {
    projectTypes: ['Landing Page', 'Web App', 'E-commerce', 'Portfolio', 'Dashboard', 'SaaS Platform'],
    complexities: ['Simple', 'Medium', 'Complex', 'Enterprise'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Python', 'AI Integration'],
    timelines: ['1-2 Weeks', '2-3 Weeks', '1 Month', '2-3 Months'],
  };

  // AI-powered suggestion generation based on message
  const generateSuggestions = (message) => {
    const lowerMessage = message.toLowerCase();
    const newSuggestions = { ...aiSuggestions };

    // Detect project type
    if (lowerMessage.includes('landing') || lowerMessage.includes('page')) {
      newSuggestions.projectType = 'Landing Page';
    } else if (lowerMessage.includes('app') || lowerMessage.includes('application')) {
      newSuggestions.projectType = 'Web App';
    } else if (lowerMessage.includes('portfolio')) {
      newSuggestions.projectType = 'Portfolio';
    } else if (lowerMessage.includes('dashboard') || lowerMessage.includes('analytics')) {
      newSuggestions.projectType = 'Dashboard';
    } else if (lowerMessage.includes('ecommerce') || lowerMessage.includes('shop')) {
      newSuggestions.projectType = 'E-commerce';
    }

    // Detect complexity
    if (lowerMessage.includes('simple') || lowerMessage.includes('basic')) {
      newSuggestions.complexity = 'Simple';
    } else if (lowerMessage.includes('complex') || lowerMessage.includes('advanced')) {
      newSuggestions.complexity = 'Complex';
    } else if (message.length > 200) {
      newSuggestions.complexity = 'Medium';
    }

    // Detect technologies
    const techs = [];
    if (lowerMessage.includes('react')) techs.push('React');
    if (lowerMessage.includes('next')) techs.push('Next.js');
    if (lowerMessage.includes('typescript')) techs.push('TypeScript');
    if (lowerMessage.includes('ai') || lowerMessage.includes('gpt')) techs.push('AI Integration');
    if (techs.length > 0) {
      newSuggestions.technologies = techs;
    }

    // Detect timeline
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap')) {
      newSuggestions.timeline = '1-2 Weeks';
    } else if (lowerMessage.includes('month')) {
      newSuggestions.timeline = '1 Month';
    }

    setAiSuggestions(newSuggestions);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'message' && value.length > 20) {
      generateSuggestions(value);
    }
  };

  const handleFileUpload = async (files) => {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Generate preview for images
        let preview = null;
        if (file.type.startsWith('image/')) {
          preview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        }

        const response = await axios.post(`${API}/contact/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
          setUploadedFiles((prev) => [
            ...prev,
            {
              name: response.data.filename,
              path: response.data.file_path,
              type: file.type,
              size: file.size,
              preview: preview,
            },
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

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return { icon: '🖼️', color: 'from-purple-500 to-pink-500', text: 'IMAGE' };
    if (type.startsWith('video/')) return { icon: '🎬', color: 'from-cyan-500 to-blue-500', text: 'VIDEO' };
    if (type.includes('pdf')) return { icon: '📄', color: 'from-red-500 to-orange-500', text: 'PDF' };
    if (type.includes('word') || type.includes('document')) return { icon: '📝', color: 'from-blue-500 to-indigo-500', text: 'DOC' };
    if (type.includes('sheet') || type.includes('excel')) return { icon: '📊', color: 'from-emerald-500 to-teal-500', text: 'EXCEL' };
    if (type.includes('presentation') || type.includes('powerpoint')) return { icon: '📊', color: 'from-amber-500 to-yellow-500', text: 'PPT' };
    if (type.startsWith('audio/')) return { icon: '🎵', color: 'from-violet-500 to-purple-500', text: 'AUDIO' };
    return { icon: '📎', color: 'from-gray-500 to-gray-600', text: 'FILE' };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
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
      submitData.append('project_type', aiSuggestions.projectType || '');
      submitData.append('complexity', aiSuggestions.complexity || '');
      submitData.append('technologies', JSON.stringify(aiSuggestions.technologies));
      submitData.append('timeline', aiSuggestions.timeline || '');
      submitData.append('files', JSON.stringify(uploadedFiles.map((f) => f.path)));

      const response = await axios.post(`${API}/contact`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setShowSuccess(true);
        if (onSuccess) onSuccess(); // Trigger network animation
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          setAiSuggestions({ projectType: null, complexity: null, technologies: [], timeline: null });
          setUploadedFiles([]);
          setShowSuccess(false);
        }, 3000);
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
    <div className="relative">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-emerald-500/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Project Received!</h3>
              <p className="text-gray-400">I'll review your details and get back to you soon.</p>
              
              {/* Success particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-emerald-400"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 100,
                    y: Math.sin((i / 12) * Math.PI * 2) * 100,
                    opacity: 0,
                  }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Message Field with AI Assistant */}
        <div className="relative">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            Project Details
            {isMessageFocused && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 text-xs text-cyan-400"
              >
                <Sparkles className="w-3 h-3" />
                AI Assistant Active
              </motion.span>
            )}
          </label>
          <Textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setIsMessageFocused(true)}
            onBlur={() => setTimeout(() => setIsMessageFocused(false), 200)}
            rows={6}
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
            placeholder="Tell me about your project idea..."
          />

          {/* AI Suggestions */}
          <AnimatePresence>
            {(aiSuggestions.projectType || aiSuggestions.complexity || aiSuggestions.technologies.length > 0 || aiSuggestions.timeline) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 p-4 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-400">AI Project Analysis</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.projectType && (
                    <span className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                      {aiSuggestions.projectType}
                    </span>
                  )}
                  {aiSuggestions.complexity && (
                    <span className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                      {aiSuggestions.complexity} Complexity
                    </span>
                  )}
                  {aiSuggestions.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {aiSuggestions.timeline && (
                    <span className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      ~{aiSuggestions.timeline}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Assets (Optional)
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-700 bg-gray-800/30 hover:border-purple-500/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            />
            <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} />
            <p className="text-sm text-gray-400 mb-1">
              {isDragging ? 'Drop files to share your idea' : 'Drag & drop files or click to upload'}
            </p>
            <p className="text-xs text-gray-600">Images, videos, PDFs, documents (max 10MB each)</p>
          </div>

          {/* Uploaded Files - Enhanced Floating Cards */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {uploadedFiles.map((file, index) => {
                  const fileInfo = getFileIcon(file.type);
                  return (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          delay: index * 0.1
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.8, 
                        y: -20,
                        transition: { duration: 0.2 }
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      className="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm hover:border-purple-500/50 transition-all"
                    >
                      {/* Gradient Background Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${fileInfo.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      
                      {/* Content */}
                      <div className="relative p-4">
                        <div className="flex items-start gap-3">
                          {/* Preview or Icon */}
                          <div className="relative flex-shrink-0">
                            {file.preview ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-700">
                                <img 
                                  src={file.preview} 
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${fileInfo.color} flex items-center justify-center text-3xl`}>
                                {fileInfo.icon}
                              </div>
                            )}
                            
                            {/* File Type Badge */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                              className={`absolute -top-2 -right-2 px-2 py-1 rounded-md bg-gradient-to-r ${fileInfo.color} text-[10px] font-bold text-white shadow-lg`}
                            >
                              {fileInfo.text}
                            </motion.div>
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate mb-1 group-hover:text-purple-300 transition-colors">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                            
                            {/* Upload Success Indicator */}
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                            />
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            type="button"
                            onClick={() => removeFile(index)}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex-shrink-0 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Shimmer Effect on Hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Processing...
            </>
          ) : (
            <>
              Start Collaboration
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AIContactForm;
