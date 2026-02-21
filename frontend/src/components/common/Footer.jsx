import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Browse Courses', href: '#courses' },
      { name: 'Expert Tutors', href: '#tutors' },
      { name: 'Live Sessions', href: '#' },
      { name: 'Learning Paths', href: '#' },
      { name: 'Enterprise', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#about-us' },
      { name: 'Success Stories', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Partner with Us', href: '#' },
      { name: 'Press & Media', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: '24/7 Doubt Clearing', href: '#' },
      { name: 'Community Forum', href: '#' },
      { name: 'Contact Support', href: '#' },
      { name: 'System Status', href: '#' },
    ],
    legal: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Refund Policy', href: '#' },
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#1E2EDE] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14C4E7]/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#E6D929]/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
                <span className="text-[#1E2EDE] font-black text-2xl">H</span>
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">
                HOKZ<span className="text-[#14C4E7]">ACADEMY</span>
              </span>
            </div>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Empowering the next generation of global leaders through elite mentorship and innovative educational technology. Join our world-class learning community.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#14C4E7] hover:border-[#14C4E7] hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                  aria-label={social.label}
                >
                  <social.icon size={20} className="text-white group-hover:text-[#1E2EDE] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="text-[#E6D929] font-black text-sm uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4">
                {footerLinks.platform.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[#E6D929] font-black text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[#E6D929] font-black text-sm uppercase tracking-widest">Support</h4>
              <ul className="space-y-4">
                {footerLinks.support.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <h4 className="text-white font-black text-xl mb-2">Weekly Updates</h4>
              <p className="text-white/60 text-sm mb-6">Stay informed about new courses and elite faculty masterclasses.</p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#14C4E7] transition-all"
                />
                <button className="w-full py-4 bg-[#14C4E7] hover:bg-white hover:text-[#1E2EDE] text-[#1E2EDE] font-black rounded-2xl transition-all shadow-lg active:scale-95">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.legal.map(link => (
              <a key={link.name} href={link.href} className="text-white/40 hover:text-[#E6D929] transition-colors text-[11px] font-black uppercase tracking-widest">{link.name}</a>
            ))}
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-white/40 text-xs font-medium">
              &copy; {currentYear} Hokz Academy Ltd. All rights reserved.
            </p>
            <p className="text-[#14C4E7] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Engineered for Excellence
            </p>
          </div>
        </div>
      </div>

      {/* Extreme Bottom Accent */}
      <div className="mt-12 w-full h-1 bg-gradient-to-r from-transparent via-[#14C4E7] to-transparent opacity-20"></div>
    </footer>
  );
};

export default Footer;