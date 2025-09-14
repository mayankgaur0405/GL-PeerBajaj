import { useEffect } from 'react';
import { FaTimes, FaLinkedin, FaGithub, FaTwitter, FaBehance, FaDribbble, FaMedium, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';

export default function TeamMemberModal({ member, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  const getSocialIcon = (platform) => {
    const icons = {
      linkedin: FaLinkedin,
      github: FaGithub,
      twitter: FaTwitter,
      behance: FaBehance,
      dribbble: FaDribbble,
      medium: FaMedium
    };
    return icons[platform] || null;
  };

  const getRoleColor = (role) => {
    const colors = {
      Leadership: 'from-purple-500 to-pink-500',
      Development: 'from-blue-500 to-cyan-500',
      Design: 'from-pink-500 to-rose-500',
      Marketing: 'from-green-500 to-emerald-500',
      Content: 'from-orange-500 to-yellow-500',
      'Quality Assurance': 'from-red-500 to-pink-500',
      DevOps: 'from-indigo-500 to-purple-500'
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${getRoleColor(member.role)} p-8 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 p-1">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 animate-pulse" />
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
              <p className="text-xl text-white/90 mb-4">{member.designation}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>Joined {member.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Connect</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(member.socialLinks).map(([platform, url]) => {
                    const IconComponent = getSocialIcon(platform);
                    if (!IconComponent) return null;
                    
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 rounded-lg transition-all duration-300 group"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="capitalize">{platform}</span>
                        <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Role Badge */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Role</h4>
                <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getRoleColor(member.role)} text-white rounded-full text-sm font-medium`}>
                  {member.role}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="w-4 h-4" />
                    <span className="text-sm">{member.name.toLowerCase().replace(' ', '.')}@glpeerbajaj.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FaPhone className="w-4 h-4" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Experience</span>
                    <span className="font-medium text-gray-900 dark:text-white">2+ years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Projects</span>
                    <span className="font-medium text-gray-900 dark:text-white">15+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Skills</span>
                    <span className="font-medium text-gray-900 dark:text-white">{member.skills.length}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300">
                  Send Message
                </button>
                <button className="w-full py-2 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors duration-300">
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
