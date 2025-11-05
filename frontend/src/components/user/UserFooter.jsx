import React from 'react';

const UserFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info Section */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-white">Hokz Academy</span>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-orange-400">📧</span>
                <a href="mailto:hello@hozkacademy.com" className="text-sm">
                  hello@hozkacademy.com
                </a>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-orange-400">📞</span>
                <a href="tel:+919181323309" className="text-sm">
                  +91 91813 23 2309
                </a>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-orange-400">📍</span>
                <span className="text-sm">Somewhere in the World</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/benefits" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Benefits
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Our Courses
                </a>
              </li>
              <li>
                <a href="/testimonials" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Our Testimonials
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Our FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="/company" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Company
                </a>
              </li>
              <li>
                <a href="/achievements" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Achievements
                </a>
              </li>
              <li>
                <a href="/goals" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Our Goals
                </a>
              </li>
            </ul>
          </div>

          {/* Social Profiles */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Social Profiles</h3>
            <div className="flex gap-4">
              <a 
                href="#facebook" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a 
                href="#twitter" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a 
                href="#linkedin" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <p className="text-sm text-gray-300 mb-3">Stay updated with our latest courses</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-400 transition-colors"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-lg text-sm font-medium hover:from-orange-500 hover:to-yellow-600 transition-all transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 Hokz Academy. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <a href="/privacy" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                Cookie Policy
              </a>
              <a href="/support" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;