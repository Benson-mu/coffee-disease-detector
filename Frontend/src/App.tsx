import React, { useState, useEffect } from 'react'; // <-- Added useEffect
import { Coffee, Scan, Search, Globe, ChevronRight } from 'lucide-react';
import type {  Variants } from 'framer-motion'; 
import { motion } from 'framer-motion'

// --- Framer Motion Variants ---

// Stagger container for sequential animations (used for Hero and Features grid)
const containerVariants: Variants = { 
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Item variant for elements that fade and lift up (used for Hero text and buttons)
const fadeInUp: Variants = { 
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.17, 0.55, 0.55, 1], // Custom easing
    },
  },
};

// Feature card animation for viewing while scrolling
const featureCardVariants: Variants = { 
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Main App Component
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // SEO Data Definition
  const seoData = {
    title: "CoffeeScan AI | Instant, AI-Powered Coffee Quality Scanning",
    description: "Bring machine learning to the roasting floor and farm. Get instant, unbiased coffee bean grading, defect analysis, and global standard cross-referencing with a simple photo.",
    keywords: "coffee, AI, scanning, grading, quality control, roasting, specialty coffee, SCAA",
    ogTitle: "CoffeeScan AI: AI-Powered Coffee Quality Scanning",
  };

  // SEO Implementation Hook
  useEffect(() => {
    // 1. Set the primary Title Tag
    document.title = seoData.title;

    // Helper function to create or update meta tags
    const createOrUpdateMeta = (name: string, content: string, isOg = false) => {
        const attribute = isOg ? 'property' : 'name';
        const selector = isOg ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let metaTag = document.querySelector(selector);

        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute(attribute, name);
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
    };

    // 2. Set Standard Meta Tags (Description and Keywords)
    createOrUpdateMeta('description', seoData.description);
    createOrUpdateMeta('keywords', seoData.keywords);

    // 3. Set Open Graph (OG) Tags for social media sharing
    createOrUpdateMeta('og:title', seoData.ogTitle, true);
    createOrUpdateMeta('og:description', seoData.description, true);
    createOrUpdateMeta('og:type', 'website', true);
    createOrUpdateMeta('og:url', window.location.href, true);
    // Note: For a real application, you would also add 'og:image' pointing to a high-quality logo/screenshot.

  }, []); // Run once on component mount

  const features = [
    { 
      icon: Scan, 
      title: "Instant Bean Analysis", 
      description: "Use your device camera to instantly scan green or roasted coffee beans. Our AI identifies defects, varietals, and processing methods." 
    },
    { 
      icon: Globe, 
      title: "Global Grade Standards", 
      description: "Automatically cross-reference your findings against SCAA, Specialty, and Custom grading standards for unbiased quality assessment." 
    },
    { 
      icon: Search, 
      title: "Historical Data Tracking", 
      description: "Log every scan and track quality trends over time across different lots and producers. Essential for quality control and sourcing." 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
      
      {/* Header/Navigation */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Coffee className="h-6 w-6 text-amber-700 mr-2" />
              <span className="text-xl font-bold text-gray-900">CoffeeScan AI</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-amber-600 transition">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-amber-600 transition">How It Works</a>
              <a href="#pricing" className="text-sm font-medium hover:text-amber-600 transition">Pricing</a>
            </nav>

            {/* CTA Button */}
            <a 
              href="#download" 
              className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-amber-600 hover:bg-amber-700 transition duration-300"
            >
              Get Started Free
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (Animated with Framer Motion) */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pb-3 pt-2 space-y-1 sm:px-3 border-t border-gray-100"
          >
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-600">Features</a>
            <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-600">How It Works</a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-600">Pricing</a>
            <a 
              href="#download" 
              className="block mt-2 w-full text-center px-3 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700"
            >
              Get Started Free
            </a>
          </motion.div>
        )}
      </header>

      <main>
        {/* Hero Section (Animated with Framer Motion) */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-24 sm:pb-32 bg-gradient-to-br from-white via-amber-50 to-amber-100">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight"
            >
              AI-Powered <span className="text-green-700">Quality Scanning of </span> <span className="text-amber-700">Coffee Leaves</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="mt-4 max-w-3xl mx-auto text-xl text-gray-600"
            >
              CoffeeScan AI brings machine learning to the roasting floor and farm, providing instant, unbiased grading and defect analysis with just a simple photo.
            </motion.p>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="mt-8 flex justify-center space-x-4"
            >
              <motion.a 
                variants={fadeInUp}
                href="#download" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-amber-600 hover:bg-amber-700 transform hover:scale-[1.02] transition duration-300 ease-in-out"
              >
                Start Scanning Now
              </motion.a>
              <motion.a 
                variants={fadeInUp}
                href="#features" 
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition duration-300 ease-in-out"
              >
                Learn More <ChevronRight className="w-5 h-5 ml-1" />
              </motion.a>
            </motion.div>

            {/* Visual Placeholder (Simulating an App Screenshot) - Simple spring animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
              className="mt-16 w-full max-w-4xl mx-auto"
            >
              <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-10">
                <div className="flex justify-center items-center h-48 sm:h-80 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <Scan className="w-16 h-16 text-gray-400" />
                  <span className="text-gray-500 ml-4 text-lg">AI Scan Interface Placeholder</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* Features Section (Animated on Scroll) */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-gray-900"
            >The Future of Coffee Grading</motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-xl text-center text-gray-600 mb-12"
            >Stop relying on subjective assessments. Get data-driven results.</motion.p>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show" // <-- Triggers animation when section enters viewport
              viewport={{ once: true, amount: 0.2 }} 
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={featureCardVariants} // Uses the staggered item variant
                  className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300"
                >
                  <feature.icon className="h-10 w-10 text-amber-600 mb-4 bg-amber-50 p-2 rounded-lg" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action Section (Animated on Scroll) */}
        <section id="download" className="py-20 bg-amber-600">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h2 className="text-4xl font-extrabold text-white">Ready to Elevate Your Coffee Quality?</h2>
            <p className="mt-4 text-xl text-amber-100">Join the thousands of roasters and producers trusting AI for perfect quality control.</p>
            <div className="mt-8">
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-base font-bold rounded-xl shadow-2xl text-amber-700 bg-white hover:bg-gray-100 transform hover:scale-[1.05] transition duration-300 ease-in-out"
              >
                Download the App Today
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer (Standard) */}
      <footer className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CoffeeScan AI. All rights reserved.</p>
          <div className="mt-4 space-x-4 text-sm">
            <a href="#" className="hover:text-amber-500">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500">Terms of Service</a>
            <a href="#" className="hover:text-amber-500">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;