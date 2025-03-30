import React, { useState } from 'react';
import { Mail, Lock, User, Phone, LogOut, MessageSquare, AlertCircle, Home, Settings, Activity } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './supabase';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [analysis, setAnalysis] = useState<{ disease: string; recommendation: string } | null>(null);

  const analyzeFeedback = async (message: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to analyze feedback');
      return await response.json();
    } catch (error) {
      console.error('Analysis error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage === 'register') {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    } else if (currentPage === 'login') {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    } else if (currentPage === 'feedback') {
      const form = e.target as HTMLFormElement;
      const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
      const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

      try {
        // First analyze the feedback
        const analysisResult = await analyzeFeedback(message);
        setAnalysis(analysisResult);

        // Then save to database
        const { error } = await supabase
          .from('feedback')
          .insert([{ subject, message }]);

        if (error) throw error;

        toast.success('Feedback submitted successfully!');
      } catch (error) {
        toast.error('Failed to submit feedback. Please try again.');
        console.error('Error:', error);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setAnalysis(null);
  };

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
      <div className="relative transform transition-all duration-300 hover:scale-105">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          required
        />
      </div>
      <div className="relative transform transition-all duration-300 hover:scale-105">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="password"
          placeholder="Password"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        Login
      </button>
      <p className="text-center">
        Don't have an account?{' '}
        <button
          onClick={() => setCurrentPage('register')}
          className="text-blue-600 hover:underline transition-colors duration-300"
        >
          Register
        </button>
      </p>
    </form>
  );

  const renderRegistrationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
      <div className="relative transform transition-all duration-300 hover:scale-105">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Patient Name"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          required
        />
      </div>
      <div className="relative transform transition-all duration-300 hover:scale-105">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          required
        />
      </div>
      <div className="relative transform transition-all duration-300 hover:scale-105">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          required
        />
      </div>
      <div className="relative transform transition-all duration-300 hover:scale-105">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="password"
          placeholder="Password"
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        Register
      </button>
      <p className="text-center">
        Already have an account?{' '}
        <button
          onClick={() => setCurrentPage('login')}
          className="text-blue-600 hover:underline transition-colors duration-300"
        >
          Login
        </button>
      </p>
    </form>
  );

  const renderDashboard = () => (
    <div className="w-full max-w-4xl p-6 text-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8">Patient Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg transform transition-all duration-300 hover:scale-105">
          <Activity className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Activity Overview</h3>
          <p className="text-gray-600 dark:text-gray-300">Track your progress and activities</p>
        </div>
        <div className="p-6 bg-green-50 dark:bg-gray-700 rounded-lg transform transition-all duration-300 hover:scale-105">
          <MessageSquare className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Messages</h3>
          <p className="text-gray-600 dark:text-gray-300">View your communication history</p>
        </div>
        <div className="p-6 bg-purple-50 dark:bg-gray-700 rounded-lg transform transition-all duration-300 hover:scale-105">
          <Settings className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Settings</h3>
          <p className="text-gray-600 dark:text-gray-300">Manage your preferences</p>
        </div>
      </div>
    </div>
  );

  const renderFeedbackForm = () => (
    <div className="space-y-6 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8">Submit Feedback</h2>
        <div className="relative transform transition-all duration-300 hover:scale-105">
          <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            name="subject"
            type="text"
            placeholder="Subject"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required
          />
        </div>
        <div className="relative transform transition-all duration-300 hover:scale-105">
          <MessageSquare className="absolute left-3 top-6 text-gray-400" size={20} />
          <textarea
            name="message"
            placeholder="Describe your symptoms or drug reaction in detail (no length limit)"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 min-h-[200px]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Submit Feedback
        </button>
      </form>

      {analysis && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">AI Analysis Results</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Potential Condition:</p>
              <p className="text-gray-700 dark:text-gray-300">{analysis.disease}</p>
            </div>
            <div>
              <p className="font-semibold">Recommended Action:</p>
              <p className="text-gray-700 dark:text-gray-300">{analysis.recommendation}</p>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-gray-600 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ This is an AI-generated analysis. Always consult with a healthcare professional for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // const renderAboutUs = () => (
  //   <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
  //     <h2 className="text-3xl font-bold mb-8">About ADR Cares</h2>
  //     <div className="prose dark:prose-invert max-w-none">
  //       <p className="text-lg mb-4">
  //         ADR Cares is dedicated to helping individuals overcome drug addiction through comprehensive support, 
  //         monitoring, and care. Our platform provides a safe space for patients to track their progress, 
  //         communicate with healthcare providers, and access essential resources for their recovery journey.
  //       </p>
  //       <p className="text-lg mb-4">
  //         Our mission is to make addiction recovery more accessible, transparent, and effective through 
  //         technology-driven solutions and compassionate care.
  //       </p>
  //     </div>
  //   </div>
  // );

  // const renderContactUs = () => (
  //   <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
  //     <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
  //     <div className="space-y-6">
  //       <div className="flex items-center space-x-4">
  //         <PhoneCall className="h-6 w-6 text-blue-600" />
  //         <div>
  //           <p className="text-lg font-semibold">Primary Contact</p>
  //           <p className="text-gray-600 dark:text-gray-300">+91 8105362036</p>
  //         </div>
  //       </div>
  //       <div className="flex items-center space-x-4">
  //         <PhoneCall className="h-6 w-6 text-blue-600" />
  //         <div>
  //           <p className="text-lg font-semibold">Secondary Contact</p>
  //           <p className="text-gray-600 dark:text-gray-300">+91 8618106176</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className={`min-h-screen `}>
      <Toaster position="top-right" />
      <nav className="bg-white shadow-md dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-white">ADR Detection</span>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
                  >
                    <Home size={20} className="mr-1" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage('feedback')}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
                  >
                    <MessageSquare size={20} className="mr-1" />
                    Feedback
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
                  >
                    <LogOut size={20} className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* <button
                    onClick={() => setCurrentPage('about')}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
                  >
                    <Info size={20} className="mr-1" />
                    About
                  </button>
                  <button
                    onClick={() => setCurrentPage('contact')}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
                  >
                    <PhoneCall size={20} className="mr-1" />
                    Contact
                  </button> */}
                </>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {!isLoggedIn && currentPage === 'login' && renderLoginForm()}
          {!isLoggedIn && currentPage === 'register' && renderRegistrationForm()}
          {/* {!isLoggedIn && currentPage === 'about' && renderAboutUs()}
          {!isLoggedIn && currentPage === 'contact' && renderContactUs()} */}
          {isLoggedIn && currentPage === 'dashboard' && renderDashboard()}
          {isLoggedIn && currentPage === 'feedback' && renderFeedbackForm()}
        </div>
      </main>
    </div>
  );
}

export default App;