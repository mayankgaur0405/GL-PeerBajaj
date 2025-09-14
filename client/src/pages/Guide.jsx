import { useState, useEffect, useRef } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaPlay, 
  FaPause, 
  FaRedo, 
  FaDownload, 
  FaPrint, 
  FaShare, 
  FaCheck, 
  FaQuestionCircle,
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaBookmark,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { guideSteps, userJourney, faqData, demoSteps, analyticsInfo } from '../data/guideData';

export default function Guide() {
  const [activeStep, setActiveStep] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [currentDemoStep, setCurrentDemoStep] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const guideRef = useRef(null);
  const demoRef = useRef(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (guideRef.current) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Demo animation
  useEffect(() => {
    if (demoPlaying && currentDemoStep < demoSteps.length) {
      const timer = setTimeout(() => {
        setCurrentDemoStep(prev => (prev + 1) % demoSteps.length);
      }, demoSteps[currentDemoStep].duration);
      return () => clearTimeout(timer);
    }
  }, [demoPlaying, currentDemoStep]);

  const handleDemoPlay = () => {
    setDemoPlaying(!demoPlaying);
  };

  const handleDemoReset = () => {
    setDemoPlaying(false);
    setCurrentDemoStep(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GL PeerBajaj User Guide',
          text: 'Learn how to use GL PeerBajaj effectively with our comprehensive guide!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Guide link copied to clipboard!');
    }
  };

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={guideRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 animate-fadeInUp">
              <FaQuestionCircle className="w-4 h-4" />
              <span>Complete User Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              How to Use <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GL PeerBajaj</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Master our platform in minutes with this comprehensive guide. From discovery to engagement, 
              learn everything you need to succeed on GL PeerBajaj.
            </p>

            {/* 3-Step Summary */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {guideSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={() => scrollToSection('flowchart')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors duration-300"
              >
                View User Journey
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors duration-300"
              >
                Try Interactive Demo
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors duration-300"
              >
                Browse FAQ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Flowchart */}
      <section id="flowchart" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">User Journey Map</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow the complete path from discovery to engagement. Click on any node to learn more about that step.
            </p>
          </div>

          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="relative h-96 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                {/* Connection lines */}
                {userJourney.map(node => 
                  node.connections.map(connectionId => {
                    const targetNode = userJourney.find(n => n.id === connectionId);
                    if (!targetNode) return null;
                    
                    return (
                      <line
                        key={`${node.id}-${connectionId}`}
                        x1={node.position.x * 8}
                        y1={node.position.y * 3}
                        x2={targetNode.position.x * 8}
                        y2={targetNode.position.y * 3}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-300 dark:text-gray-600"
                        strokeDasharray="5,5"
                      />
                    );
                  })
                )}
                
                {/* Nodes */}
                {userJourney.map((node, index) => (
                  <g key={node.id}>
                    <circle
                      cx={node.position.x * 8}
                      cy={node.position.y * 3}
                      r="20"
                      className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
                        node.type === 'entry' ? 'fill-blue-500' :
                        node.type === 'page' ? 'fill-green-500' :
                        'fill-purple-500'
                      }`}
                      onClick={() => setActiveStep(node.id)}
                    />
                    <text
                      x={node.position.x * 8}
                      y={node.position.y * 3 + 5}
                      textAnchor="middle"
                      className="text-xs font-medium text-white fill-current"
                    >
                      {index + 1}
                    </text>
                  </g>
                ))}
              </svg>
              
              {/* Node labels */}
              {userJourney.map(node => (
                <div
                  key={`label-${node.id}`}
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${node.position.x}%`,
                    top: `${node.position.y}%`,
                  }}
                >
                  <div className="bg-white dark:bg-slate-700 rounded-lg px-3 py-1 shadow-lg border border-gray-200 dark:border-slate-600">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{node.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{node.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stepper Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Step-by-Step Guide</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Detailed instructions for each phase of your journey on GL PeerBajaj.
            </p>
          </div>

          <div className="space-y-8">
            {guideSteps.map((step, index) => (
              <div 
                key={step.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-2xl text-white shadow-lg flex-shrink-0`}>
                    {step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.details.title}</h3>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-sm rounded-full text-gray-600 dark:text-gray-300">
                        Step {index + 1}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{step.details.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FaCheck className="w-4 h-4 text-green-500" />
                          What to Do
                        </h4>
                        <ul className="space-y-2">
                          {step.details.actions.map((action, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FaArrowRight className="w-4 h-4 text-blue-500" />
                          Pro Tips
                        </h4>
                        <ul className="space-y-2">
                          {step.details.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <FaQuestionCircle className="w-4 h-4 text-orange-500" />
                          Avoid These
                        </h4>
                        <ul className="space-y-2">
                          {step.details.commonMistakes.map((mistake, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Panel */}
      <section id="demo" className="py-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Interactive Demo</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Watch a simulated user interaction to see how the platform works in practice.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resource Discovery Demo</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDemoPlay}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
                  >
                    {demoPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                    {demoPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={handleDemoReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                  >
                    <FaRedo className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="relative bg-gray-50 dark:bg-slate-700 rounded-xl p-6 min-h-64">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search for study materials..."
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                    <FaFilter className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4">
                  {demoSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border transition-all duration-500 ${
                        index === currentDemoStep && demoPlaying
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{step.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaBookmark className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Resource {index + 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {demoSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentDemoStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find quick answers to common questions about using GL PeerBajaj.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq) => (
              <div key={faq.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors duration-300"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{faq.category}</span>
                  </div>
                  {activeFaq === faq.id ? (
                    <FaChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                {activeFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-16 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Privacy</h2>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300"
                >
                  {showAnalytics ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  {showAnalytics ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">{analyticsInfo.description}</p>
              
              {showAnalytics && (
                <div className="space-y-4">
                  {analyticsInfo.events.map((event, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{event.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Purpose: {event.purpose}</p>
                    </div>
                  ))}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">{analyticsInfo.optOut}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ready to Get Started?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Now that you know how to use GL PeerBajaj, it's time to begin your learning journey!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors duration-300"
              >
                <FaPrint className="w-4 h-4" />
                Print Guide
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors duration-300"
              >
                <FaShare className="w-4 h-4" />
                Share Guide
              </button>
              <button
                onClick={() => window.location.href = '/signup'}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors duration-300"
              >
                <FaArrowRight className="w-4 h-4" />
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
