import React from "react";

const AdminFooter = () => {
  return (
    <footer className="w-full bg-black text-white py-12 px-8 mt-auto">
      <div className="w-full px-4 sm:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 leading-snug">
              Empowering learners through accessible and engaging online education.
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Byway is a leading online learning platform dedicated to providing
              high-quality, flexible, and affordable educational experiences.
            </p>
          </div>

          {/* Get Help Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get Help</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/articles"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Latest Articles
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Programs Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Programs</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/art-design"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Art & Design
                </a>
              </li>
              <li>
                <a
                  href="/business"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Business
                </a>
              </li>
              <li>
                <a
                  href="/it-software"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  IT & Software
                </a>
              </li>
              <li>
                <a
                  href="/languages"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Languages
                </a>
              </li>
              <li>
                <a
                  href="/programming"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Programming
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <div className="space-y-3 mb-6 text-gray-400 text-sm">
              <p>Address: 123 Main Street, Anytown, CA 12345</p>
              <p>Tel: +1 (123) 456-7890</p>
              <p>Mail: byway.edu@webkul.in</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-3">
              {/* Facebook */}
              <a
                href="#facebook"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="#github"
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              {/* Google */}
              <a
                href="#google"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 transform hover:scale-110"
                aria-label="Google"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="#twitter"
                className="w-10 h-10 bg-black border border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 Scholaro. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
