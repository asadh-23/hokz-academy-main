import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Star, 
  BookOpen, 
  Clock, 
  MoreVertical, 
  Heart, 
  Search,
  Bell,
  User
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_COURSES = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2024",
    instructor: "Dr. Angela Yu",
    rating: 4.8,
    students: "1.2k",
    price: 19.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    tag: "Bestseller",
    duration: "62h 40m",
    lectures: 420
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass: From Beginner to Pro",
    instructor: "Gary Simon",
    rating: 4.9,
    students: "850",
    price: 24.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&w=800&q=80",
    tag: "New",
    duration: "28h 15m",
    lectures: 145
  },
  {
    id: 3,
    title: "Python for Data Science and Machine Learning",
    instructor: "Jose Portilla",
    rating: 4.7,
    students: "2.5k",
    price: 14.99,
    originalPrice: 74.99,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
    tag: null,
    duration: "34h 10m",
    lectures: 210
  },
  {
    id: 4,
    title: "Advanced React & Next.js Patterns",
    instructor: "Kent C. Dodds",
    rating: 4.9,
    students: "500",
    price: 39.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    tag: "Highest Rated",
    duration: "18h 30m",
    lectures: 88
  }
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(INITIAL_COURSES);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(course => course.id !== id));
  };

  const moveToCart = (course) => {
    alert(`Added ${course.title} to cart!`);
    // Add cart logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="mt-2 text-gray-500">
              {wishlist.length} {wishlist.length === 1 ? 'course' : 'courses'} saved for later
            </p>
          </div>
          {wishlist.length > 0 && (
             <button 
               onClick={() => setWishlist([])}
               className="mt-4 sm:mt-0 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
             >
               Remove all
             </button>
          )}
        </div>

        {/* --- Wishlist Grid --- */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((course) => (
              <div 
                key={course.id} 
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-indigo-600 rounded-md shadow-sm">
                      {course.tag}
                    </span>
                  )}
                  <button 
                    onClick={() => removeFromWishlist(course.id)}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors cursor-pointer">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <span className="text-sm">{course.rating}</span>
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {course.students}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Action */}
                  <div className="pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                      <span className="text-sm text-gray-400 line-through mb-1">${course.originalPrice}</span>
                    </div>
                    
                    <button 
                      onClick={() => moveToCart(course)}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- Empty State --- */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Explore our catalog and save courses you want to take in the future.
            </p>
            <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all transform hover:-translate-y-1">
              Browse Courses
            </button>
          </div>
        )}
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2024 LearnFlow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Wishlist;