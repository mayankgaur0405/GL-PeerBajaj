import { useState } from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaBehance, FaDribbble, FaMedium, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export default function TeamCard({ member, onViewProfile, index }) {
  const [isHovered, setIsHovered] = useState(false);

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
      Leadership: 'bg-gradient-to-r from-purple-500 to-pink-500',
      Development: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      Design: 'bg-gradient-to-r from-pink-500 to-rose-500',
      Marketing: 'bg-gradient-to-r from-green-500 to-emerald-500',
      Content: 'bg-gradient-to-r from-orange-500 to-yellow-500',
      'Quality Assurance': 'bg-gradient-to-r from-red-500 to-pink-500',
      DevOps: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    };
    return colors[role] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div
      className={`
        team-card group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl 
        transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-105
        border border-gray-200 dark:border-slate-700 overflow-hidden
        animate-fadeInUp flex flex-col h-full
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500
        pointer-events-none
      `} />
      
      {/* Role badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`
          px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg
          ${getRoleColor(member.role)}
          transform transition-transform duration-300
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}>
          {member.role}
        </span>
      </div>

      {/* Fixed Height Profile Image Section */}
      <div className="relative p-6 pb-4 h-32 flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 p-0.5">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-avatar.svg';
                }}
              />
            </div>
          </div>
          
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Flexible Content Area with Fixed Bottom Button */}
      <div className="px-6 pb-6 flex flex-col flex-1">
        {/* Name and Designation - Fixed Height */}
        <div className="text-center mb-4 h-16 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
            {member.name}
          </h3>
          <p className="designation text-sm text-gray-600 dark:text-gray-300 font-medium line-clamp-1">
            {member.designation}
          </p>
        </div>

        {/* Bio - Fixed Height */}
        <div className="mb-4 h-16 flex items-center">
          <p className="bio text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-3 leading-relaxed w-full">
            {member.bio}
          </p>
        </div>

        {/* Location and Join Date - Fixed Height */}
        <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400 h-6">
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{member.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Joined {member.joinDate}</span>
          </div>
        </div>

        {/* Skills - Fixed Height */}
        <div className="mb-4 h-8 flex items-center">
          <div className="skills-container flex flex-wrap gap-1 justify-center w-full">
            {member.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded-full text-gray-600 dark:text-gray-300 whitespace-nowrap"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded-full text-gray-600 dark:text-gray-300">
                +{member.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Social Links - Fixed Height */}
        <div className="social-icons-container flex justify-center gap-3 mb-4 h-8 items-center">
          {Object.entries(member.socialLinks).map(([platform, url]) => {
            const IconComponent = getSocialIcon(platform);
            if (!IconComponent) return null;
            
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 
                  flex items-center justify-center text-gray-600 dark:text-gray-300
                  hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600
                  transition-all duration-300 transform hover:scale-110
                  flex-shrink-0
                  ${isHovered ? 'animate-bounce' : ''}
                `}
                style={{ animationDelay: `${Object.keys(member.socialLinks).indexOf(platform) * 0.1}s` }}
              >
                <IconComponent className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* View Profile Button - Fixed at Bottom */}
        <button
          onClick={() => onViewProfile(member)}
          className={`
            w-full py-2 px-4 rounded-lg font-medium text-sm
            bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
            text-white shadow-lg hover:shadow-xl
            transform transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            mt-auto
            ${isHovered ? 'animate-pulse' : ''}
          `}
        >
          View Profile
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Corner decoration */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}