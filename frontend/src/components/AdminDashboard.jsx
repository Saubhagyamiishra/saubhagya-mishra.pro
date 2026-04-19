import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, Calendar, FileText, Download, X, Eye, Lock, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchSubmissions();
    } else {
      alert('Invalid password');
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/contact/submissions`);
      if (response.data.success) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (submissionId, newStatus) => {
    try {
      await axios.patch(`${API}/contact/submissions/${submissionId}/status?status=${newStatus}`);
      fetchSubmissions();
      if (selectedSubmission && selectedSubmission._id === submissionId) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      case 'reviewed':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'replied':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Enter password to access submissions</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
              >
                Access Dashboard
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Submissions Dashboard</h1>
            <p className="text-gray-400">
              {submissions.length} total submissions
            </p>
          </div>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading submissions...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all cursor-pointer h-full">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>
                    <Button
                      onClick={() => setSelectedSubmission(submission)}
                      size="sm"
                      className="p-2 h-auto bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Name & Email */}
                  <h3 className="text-lg font-bold text-white mb-2">{submission.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    {submission.email}
                  </p>

                  {/* Message Preview */}
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {submission.message}
                  </p>

                  {/* Project Details */}
                  {submission.project_type && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded">
                        {submission.project_type}
                      </span>
                      {submission.complexity && (
                        <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded">
                          {submission.complexity}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date & Files */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </span>
                    {submission.files && submission.files.length > 0 && (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <FileText className="w-3 h-3" />
                        {submission.files.length} files
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedSubmission.name}
                    </h2>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedSubmission.email}
                    </p>
                  </div>
                  <Button
                    onClick={() => setSelectedSubmission(null)}
                    size="icon"
                    className="bg-gray-800 hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Status Update */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Update Status
                  </label>
                  <div className="flex gap-2">
                    {['new', 'reviewed', 'replied'].map((status) => (
                      <Button
                        key={status}
                        onClick={() => updateStatus(selectedSubmission._id, status)}
                        className={`${
                          selectedSubmission.status === status
                            ? getStatusColor(status)
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                {(selectedSubmission.project_type ||
                  selectedSubmission.complexity ||
                  selectedSubmission.timeline) && (
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">
                      Project Details
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.project_type && (
                        <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                          {selectedSubmission.project_type}
                        </span>
                      )}
                      {selectedSubmission.complexity && (
                        <span className="px-3 py-1 text-sm bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                          {selectedSubmission.complexity}
                        </span>
                      )}
                      {selectedSubmission.timeline && (
                        <span className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                          {selectedSubmission.timeline}
                        </span>
                      )}
                      {selectedSubmission.technologies &&
                        selectedSubmission.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Message
                  </label>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-300 whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>
                </div>

                {/* Files */}
                {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Uploaded Files ({selectedSubmission.files.length})
                    </label>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((file) => (
                        <div
                          key={`${selectedSubmission.id}-file-${file}`}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/20 rounded">
                              <FileText className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-sm text-white">{file}</span>
                          </div>
                          <a
                            href={`${API}/contact/files/${file}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="sm"
                              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submission Date */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
