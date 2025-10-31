import React from 'react';

const TutorFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-8 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div className="md:col-span-2">
          <p className="text-gray-300 leading-relaxed text-sm m-0">
            Empowering learners through personalized and engaging online education. 
            Scholaro is a leading online learning platform dedicated to providing 
            high-quality, flexible, and affordable educational opportunities.
          </p>
        </div>

        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Get Help</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li><a href="#contact" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">Contact Us</a></li>
            <li><a href="#articles" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">Latest Articles</a></li>
            <li><a href="#faq" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Programs</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li><a href="#art" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">Art & Design</a></li>
            <li><a href="#business" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">Business</a></li>
            <li><a href="#it" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">IT & Software</a></li>
            <li><a href="#languages" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">Languages</a></li>
            <li><a href="#programming" className="text-gray-300 no-underline text-sm transition-colors hover:text-emerald-400">Programming</a></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <div className="mb-6 space-y-2">
              <p className="text-gray-300 text-sm m-0">Address: 123 Main Street, Anytown, CA 12345</p>
              <p className="text-gray-300 text-sm m-0">Tel: +1(123) 456-7890</p>
              <p className="text-gray-300 text-sm m-0">Mail: info@scholaro@email.com</p>
            </div>
          </div>
          
          <div className="flex justify-start md:justify-end items-start">
            <div className="flex gap-3">
              <a href="#facebook" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white no-underline font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">f</a>
              <a href="#github" className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white no-underline font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">G</a>
              <a href="#google" className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white no-underline font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">G</a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-white no-underline font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">X</a>
              <a href="#other" className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white no-underline font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">O</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TutorFooter;