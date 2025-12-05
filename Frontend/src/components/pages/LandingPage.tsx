import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { LandingPageProps } from '../../types';
import AlertMessage from '../ui/AlertMessage';
import { IconUploadInternal, IconMicroscope, IconCheckCircleInternal, Grid } from '../ui/Icons';
import DelayedLink from '../ui/DelayedLink';

const LandingPage: React.FC<LandingPageProps> = ({ message, setMessage }) => {
  useEffect(() => {
    if (message.message) {
      const timer = setTimeout(() => setMessage({ message: null, type: null }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  return (
    <div className="min-h-full bg-black">
      {message.message && (
        <div className="fixed top-20 right-4 z-50">
          <AlertMessage message={message.message} type={message.type} />
        </div>
      )}

      {/* Hero Section */}
      <header className="pt-32 pb-20 text-white relative text-center px-8">
        <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">AI for Coffee Farmers</p>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Coffee Plant Sick? <br /> Let <span className="text-yellow-400">CoffeeScanAI</span> Help
        </h1>
        <p className="text-lg text-amber-300 mb-10 max-w-2xl mx-auto">
          Upload a coffee leaf photo, get instant diagnosis and simple advice to save your plants.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
          <DelayedLink 
            to="/login" 
            className="bg-amber-500 text-black font-bold py-3 px-8 rounded-lg text-lg shadow-xl hover:bg-yellow-400 transition flex items-center justify-center space-x-2"
            delayMs={500}
          >
            Start Diagnosis
          </DelayedLink>
          <Link
            to="/#how-it-works"
            className="bg-brown-800 text-yellow-400 font-bold py-3 px-8 rounded-lg text-lg shadow-xl border border-amber-400 hover:bg-brown-700 transition flex items-center justify-center"
          >
            See How It Works →
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-12">
          <span className="text-sm font-semibold text-white flex items-center">
            <IconCheckCircleInternal className="h-4 w-4 text-amber-400 mr-1" /> Works Offline
          </span>
          <span className="text-sm font-semibold text-white flex items-center">
            <IconCheckCircleInternal className="h-4 w-4 text-amber-400 mr-1" /> Swahili Supported
          </span>
          <span className="text-sm font-semibold text-white flex items-center">
            <IconCheckCircleInternal className="h-4 w-4 text-amber-400 mr-1" /> Mobile Ready
          </span>
          <span className="text-sm font-semibold text-white flex items-center">
            <IconCheckCircleInternal className="h-4 w-4 text-amber-400 mr-1" /> High Accuracy
          </span>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-brown-900 border-b border-brown-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-yellow-400 mb-16">Diagnose in 3 Easy Steps</h2>
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 p-8 rounded-xl bg-brown-800/80 shadow-2xl border-l-8 border-amber-400">

            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <span className="text-4xl font-black text-amber-400">1.</span>
              <div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-1 flex items-center space-x-2">
                  <IconUploadInternal className="h-6 w-6 text-amber-400" /> <span>Upload Leaf</span>
                </h3>
                <p className="text-amber-200">
                  Take a clear photo of your coffee leaf and upload. Our system prepares it automatically for analysis.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <span className="text-4xl font-black text-amber-400">2.</span>
              <div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-1 flex items-center space-x-2">
                  <IconMicroscope className="h-6 w-6 text-amber-400" /> <span>Instant Diagnosis</span>
                </h3>
                <p className="text-amber-200">
                  AI checks your leaf for diseases and gives a confidence score in seconds.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <span className="text-4xl font-black text-amber-400">3.</span>
              <div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-1 flex items-center space-x-2">
                  <IconCheckCircleInternal className="h-6 w-6 text-amber-400" /> <span>Action Plan</span>
                </h3>
                <p className="text-amber-200">
                  Get simple steps to treat, prevent, and keep your coffee plants healthy.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-black border-b border-brown-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-yellow-400 mb-4">Why CoffeeScanAI?</h2>
          <p className="text-lg text-amber-300 mb-16 max-w-3xl mx-auto">AI that helps you save coffee plants fast and easy.</p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-brown-800 rounded-xl shadow-xl border-t-4 border-amber-400 hover:shadow-2xl transition text-white">
              <Grid className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Fast Disease Detection</h3>
              <p className="text-amber-200">Identify coffee diseases like Rust or Leaf Spot instantly.</p>
            </div>
            <div className="p-6 bg-brown-800 rounded-xl shadow-xl border-t-4 border-yellow-400 hover:shadow-2xl transition text-white">
              <IconMicroscope className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="text-xl font-bold mb-2">Confidence Scores</h3>
              <p className="text-amber-200">Know how sure AI is before taking action on your plants.</p>
            </div>
            <div className="p-6 bg-brown-800 rounded-xl shadow-xl border-t-4 border-amber-500 hover:shadow-2xl transition text-white">
              <IconCheckCircleInternal className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="text-xl font-bold mb-2">Simple Advice</h3>
              <p className="text-amber-200">Follow easy steps to treat or prevent disease, protect yields.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-32 bg-brown-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-yellow-400 mb-4">Start Saving Your Coffee Plants</h2>
          <p className="text-lg text-amber-300 mb-6">
            Upload a leaf image and get instant diagnosis and actionable advice.
          </p>
          <Link 
            to="/register" 
            className="inline-block py-3 px-8 bg-amber-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
