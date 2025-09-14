export const guideSteps = [
  {
    id: 'discover',
    title: 'Discover',
    description: 'Explore our platform and find valuable resources',
    icon: '🔍',
    color: 'from-blue-500 to-cyan-500',
    details: {
      title: 'Discover GL PeerBajaj',
      description: 'Start your journey by exploring our comprehensive learning platform designed for students.',
      actions: [
        'Browse trending resources and study materials',
        'View featured content on the homepage',
        'Check out our team and community',
        'Read success stories and testimonials'
      ],
      tips: [
        'Use the search bar to find specific topics',
        'Filter content by subject or difficulty level',
        'Bookmark interesting resources for later',
        'Follow trending discussions'
      ],
      commonMistakes: [
        'Not exploring all available sections',
        'Ignoring the trending content',
        'Not checking the team page for credibility'
      ]
    }
  },
  {
    id: 'register',
    title: 'Register',
    description: 'Create your account to unlock full features',
    icon: '📝',
    color: 'from-green-500 to-emerald-500',
    details: {
      title: 'Create Your Account',
      description: 'Join our community of learners and gain access to exclusive features and personalized content.',
      actions: [
        'Click the Sign Up button in the navbar',
        'Fill in your basic information',
        'Verify your email address',
        'Complete your profile setup'
      ],
      tips: [
        'Use a valid email address for verification',
        'Choose a strong, memorable password',
        'Upload a profile picture for better engagement',
        'Add your academic interests and goals'
      ],
      commonMistakes: [
        'Using an invalid email address',
        'Choosing a weak password',
        'Skipping profile completion',
        'Not verifying email address'
      ]
    }
  },
  {
    id: 'engage',
    title: 'Engage',
    description: 'Connect, learn, and grow with the community',
    icon: '🚀',
    color: 'from-purple-500 to-pink-500',
    details: {
      title: 'Engage & Learn',
      description: 'Maximize your learning experience by actively participating in our community and utilizing all available features.',
      actions: [
        'Post questions and share knowledge',
        'Connect with peers and mentors',
        'Participate in discussions',
        'Access exclusive study materials'
      ],
      tips: [
        'Be active in the feed section',
        'Join relevant discussions',
        'Share helpful resources',
        'Ask questions when stuck'
      ],
      commonMistakes: [
        'Not participating in discussions',
        'Ignoring community guidelines',
        'Not utilizing all available features',
        'Being passive instead of active'
      ]
    }
  }
];

export const userJourney = [
  {
    id: 'homepage',
    title: 'Homepage',
    description: 'Landing page with overview',
    type: 'entry',
    position: { x: 50, y: 20 },
    connections: ['trending', 'team', 'signup']
  },
  {
    id: 'trending',
    title: 'Trending',
    description: 'Popular content and resources',
    type: 'page',
    position: { x: 20, y: 40 },
    connections: ['signup', 'feed']
  },
  {
    id: 'team',
    title: 'Our Team',
    description: 'Meet the creators',
    type: 'page',
    position: { x: 80, y: 40 },
    connections: ['signup']
  },
  {
    id: 'signup',
    title: 'Sign Up',
    description: 'Create your account',
    type: 'action',
    position: { x: 50, y: 60 },
    connections: ['login', 'profile']
  },
  {
    id: 'login',
    title: 'Login',
    description: 'Access your account',
    type: 'action',
    position: { x: 30, y: 80 },
    connections: ['feed', 'profile']
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your information',
    type: 'page',
    position: { x: 70, y: 80 },
    connections: ['feed']
  },
  {
    id: 'feed',
    title: 'Your Feed',
    description: 'Personalized content',
    type: 'page',
    position: { x: 50, y: 100 },
    connections: ['chat']
  },
  {
    id: 'chat',
    title: 'Messages',
    description: 'Connect with peers',
    type: 'page',
    position: { x: 50, y: 120 },
    connections: []
  }
];

export const faqData = [
  {
    id: 'account',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the top navigation, fill in your details, verify your email, and complete your profile. It takes less than 2 minutes!',
    category: 'Getting Started'
  },
  {
    id: 'password',
    question: 'I forgot my password. What should I do?',
    answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive a reset link within a few minutes.',
    category: 'Account Issues'
  },
  {
    id: 'profile',
    question: 'How do I update my profile information?',
    answer: 'Go to your profile page by clicking your name in the navbar, then click "Edit Profile" to update your information, photo, and preferences.',
    category: 'Profile Management'
  },
  {
    id: 'content',
    question: 'How do I find study materials for my subject?',
    answer: 'Use the search bar on the homepage or browse the "Trending" section. You can also filter by subject, year, or semester in the study materials section.',
    category: 'Content & Resources'
  },
  {
    id: 'chat',
    question: 'How do I message other students?',
    answer: 'Go to the "Messages" section in the navbar. You can start new conversations or continue existing ones. All messages are private and secure.',
    category: 'Communication'
  },
  {
    id: 'privacy',
    question: 'Is my data safe and private?',
    answer: 'Yes! We use industry-standard encryption and never share your personal information. You can read our full privacy policy in the footer.',
    category: 'Privacy & Security'
  }
];

export const demoSteps = [
  {
    id: 'search',
    title: 'Search for Resources',
    description: 'Type in the search bar to find relevant study materials',
    action: 'typing',
    target: '.search-bar',
    duration: 2000
  },
  {
    id: 'filter',
    title: 'Filter Results',
    description: 'Use filters to narrow down your search results',
    action: 'click',
    target: '.filter-button',
    duration: 1500
  },
  {
    id: 'select',
    title: 'Select Resource',
    description: 'Click on a resource to view details and download',
    action: 'click',
    target: '.resource-card',
    duration: 2000
  },
  {
    id: 'bookmark',
    title: 'Bookmark for Later',
    description: 'Save resources to your favorites for easy access',
    action: 'click',
    target: '.bookmark-button',
    duration: 1500
  }
];

export const analyticsInfo = {
  title: 'Analytics & Privacy',
  description: 'We track certain user interactions to improve your experience and our platform.',
  events: [
    {
      name: 'Page Views',
      description: 'Which pages you visit to understand popular content',
      purpose: 'Improve content organization and navigation'
    },
    {
      name: 'Search Queries',
      description: 'What you search for to enhance search results',
      purpose: 'Better search suggestions and content recommendations'
    },
    {
      name: 'Resource Downloads',
      description: 'Which materials you access to identify popular content',
      purpose: 'Curate better study materials and resources'
    },
    {
      name: 'Feature Usage',
      description: 'How you use different features to optimize the interface',
      purpose: 'Improve user experience and feature placement'
    }
  ],
  optOut: 'You can opt out of analytics tracking in your profile settings under "Privacy Preferences".'
};
