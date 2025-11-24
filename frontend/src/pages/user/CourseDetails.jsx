import React, { useState } from 'react';
import { 
  Star, 
  PlayCircle, 
  Clock, 
  Award, 
  FileText, 
  Download, 
  Smartphone, 
  Infinity, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Globe,
  AlertCircle,
  Share2,
  Heart,
  Play
} from 'lucide-react';

// --- Mock Data ---
const COURSE_DATA = {
  id: 1,
  title: "Complete Web Development Bootcamp 2024: Zero to Mastery",
  subtitle: "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps",
  rating: 4.8,
  reviews: "12,405",
  students: "450,200",
  instructor: {
    name: "Dr. Angela Yu",
    role: "Lead Instructor & Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    courses: 12,
    reviews: "850k"
  },
  lastUpdated: "November 2024",
  language: "English",
  price: 19.99,
  originalPrice: 89.99,
  discount: "78% off",
  previewImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1000&q=80",
  features: [
    "65 hours on-demand video",
    "85 coding exercises",
    "55 articles",
    "Full lifetime access",
    "Access on mobile and TV",
    "Certificate of completion"
  ],
  learningPoints: [
    "Build 16 web development projects for your portfolio",
    "Learn the latest technologies, including Javascript, React, Node and even Web3 development",
    "After the course you will be able to build ANY website you want",
    "Build fully-fledged websites and web apps for your startup or business",
    "Master backend development with Node",
    "Learn professional developer best practices"
  ],
  curriculum: [
    { title: "Introduction to HTML", time: "45m", lectures: 5, isOpen: true },
    { title: "Intermediate CSS", time: "1h 20m", lectures: 8, isOpen: false },
    { title: "Javascript Fundamentals", time: "3h 10m", lectures: 15, isOpen: false },
    { title: "React.js - The Complete Guide", time: "8h 45m", lectures: 24, isOpen: false },
  ]
};

const CourseDetails = () => {
  // State for curriculum accordion
  const [sections, setSections] = useState(COURSE_DATA.curriculum);

  const toggleSection = (index) => {
    const newSections = [...sections];
    newSections[index].isOpen = !newSections[index].isOpen;
    setSections(newSections);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* --- Navbar (Simplified) --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="font-bold text-xl text-gray-800">LearnFlow</div>
          <div className="flex gap-4">
             <button className="text-gray-600 hover:text-indigo-600">Log In</button>
             <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section (Dark Theme) --- */}
      <header className="bg-gray-900 text-white pt-10 pb-12 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:w-2/3 pr-0 lg:pr-8">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-4">
              <span>Development</span>
              <span className="text-gray-500">/</span>
              <span>Web Development</span>
              <span className="text-gray-500">/</span>
              <span>Full Stack</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              {COURSE_DATA.title}
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {COURSE_DATA.subtitle}
            </p>

            {/* Ratings & Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1">
                <span className="text-amber-400 font-bold">{COURSE_DATA.rating}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-indigo-200 underline cursor-pointer ml-1">
                  ({COURSE_DATA.reviews} ratings)
                </span>
              </div>
              <span className="text-gray-500 hidden sm:block">•</span>
              <span className="text-gray-300">{COURSE_DATA.students} students</span>
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Last updated {COURSE_DATA.lastUpdated}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {COURSE_DATA.language}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- Main Layout (Grid) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          
          {/* --- Left Column (Content) --- */}
          <div className="lg:col-span-2 space-y-10">

            {/* What you'll learn */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {COURSE_DATA.learningPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
              <div className="text-sm text-gray-500 mb-4 flex gap-2">
                <span>4 sections</span> • <span>52 lectures</span> • <span>13h 20m total length</span>
              </div>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                {sections.map((section, idx) => (
                  <div key={idx} className="border-b border-gray-200 last:border-0">
                    <button 
                      onClick={() => toggleSection(idx)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        {section.isOpen ? <ChevronUp className="w-4 h-4 text-gray-600"/> : <ChevronDown className="w-4 h-4 text-gray-600"/>}
                        <span className="font-bold text-gray-800">{section.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 hidden sm:block">{section.lectures} lectures • {section.time}</span>
                    </button>
                    
                    {/* Dropdown Content */}
                    {section.isOpen && (
                      <div className="bg-white p-4 space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex justify-between items-center text-sm px-2">
                            <div className="flex items-center gap-3 text-gray-600">
                              <PlayCircle className="w-4 h-4 text-gray-400" />
                              <span>Introduction to {section.title.split(' ')[0]} Part {i+1}</span>
                            </div>
                            <span className="text-gray-400">04:20</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
               <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
               <div className="prose prose-indigo text-gray-600 max-w-none">
                 <p className="mb-4">
                   Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. With over 65 hours of video content, this comprehensive course covers everything from the basics of HTML and CSS to advanced topics like React, Node.js, and Web3.
                 </p>
                 <p>
                   This course is designed for beginners. No previous coding experience is required. We will start from the very beginning and walk you through every step.
                 </p>
               </div>
            </div>

            {/* Instructor */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
              <div>
                <h3 className="font-bold text-indigo-600 text-lg underline mb-1">{COURSE_DATA.instructor.name}</h3>
                <p className="text-gray-500 mb-4">{COURSE_DATA.instructor.role}</p>
                
                <div className="flex items-start gap-4 sm:gap-6">
                  <img 
                    src={COURSE_DATA.instructor.image} 
                    alt={COURSE_DATA.instructor.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                       <Award className="w-4 h-4 text-gray-900" />
                       <span>{COURSE_DATA.instructor.reviews} Reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Star className="w-4 h-4 text-gray-900" />
                       <span>{COURSE_DATA.rating} Instructor Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <PlayCircle className="w-4 h-4 text-gray-900" />
                       <span>{COURSE_DATA.instructor.courses} Courses</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  Angela is a lead instructor at the App Brewery, London's leading programming bootcamp. She has dedicated her career to teaching people how to code and making technology accessible to everyone.
                </p>
              </div>
            </div>
          
          </div>

          {/* --- Right Column (Sticky Sidebar) --- */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-24">
              
              {/* Card Container - floats over hero slightly on large screens */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden lg:-mt-64 relative z-10">
                
                {/* Preview Video Image */}
                <div className="relative aspect-video group cursor-pointer">
                  <img 
                    src={COURSE_DATA.previewImage} 
                    alt="Course preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-indigo-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="font-bold text-white drop-shadow-md">Preview this course</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-3xl font-bold text-gray-900">${COURSE_DATA.price}</span>
                    <span className="text-gray-400 line-through mb-1">${COURSE_DATA.originalPrice}</span>
                    <span className="text-indigo-600 font-bold mb-1 ml-auto">{COURSE_DATA.discount}</span>
                  </div>

                  <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98] mb-3">
                    Add to Cart
                  </button>
                  <button className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-all mb-6">
                    Buy Now
                  </button>
                  
                  <p className="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                  {/* Includes List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-gray-900">This course includes:</h4>
                    <ul className="text-sm text-gray-600 space-y-2.5">
                      <li className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" /> {COURSE_DATA.features[0]}
                      </li>
                      <li className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" /> {COURSE_DATA.features[1]}
                      </li>
                      <li className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-gray-400" /> {COURSE_DATA.features[2]}
                      </li>
                      <li className="flex items-center gap-3">
                        <Infinity className="w-4 h-4 text-gray-400" /> {COURSE_DATA.features[3]}
                      </li>
                      <li className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-gray-400" /> {COURSE_DATA.features[4]}
                      </li>
                      <li className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-gray-400" /> {COURSE_DATA.features[5]}
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 underline">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 underline">
                      <Heart className="w-4 h-4" /> Save to Wishlist
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="font-bold text-xl text-gray-800 mb-4">LearnFlow</div>
          <p className="text-gray-500 text-sm">&copy; 2024 LearnFlow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetails;