import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck, Globe, Users, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { toast } from "sonner";
import aboutSectionImage from "../../assets/images/about_sectionImage.avif";


const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        toast.success("Form submitted successfully");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* --- HERO SECTION --- */}
            <section className="relative bg-blue-900 py-20 px-4 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                    >
                        Let’s Build Your <span className="text-blue-400">Future</span> Together
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Join 50,000+ students at Hokz Academy. Whether you have a question about a course or need technical
                        support, our experts are ready to help.
                    </motion.p>
                </div>
            </section>

            {/* --- TRUST BADGES --- */}
            <div className="max-w-7xl mx-auto -mt-10 px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-18">
                    {[
                        { icon: <ShieldCheck />, label: "Secure Learning" },
                        { icon: <Users />, label: "Expert Mentors" },
                        { icon: <Globe />, label: "Global Access" },
                        { icon: <MessageSquare />, label: "24/7 Support" },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                            className="bg-white p-4 rounded-xl shadow-lg flex items-center justify-center space-x-3 border border-gray-100"
                        >
                            <div className="text-blue-600">{item.icon}</div>
                            <span className="font-semibold text-gray-700 text-sm md:text-base">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <section className="max-w-7xl mx-auto py-20 px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* LEFT COLUMN: INFO & IMAGE */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            We aim to respond to all inquiries within one business day. Feel free to reach out through any
                            of these channels.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:border-blue-500 transition-colors">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                    <p className="text-gray-800 font-medium">hokzacademy@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:border-green-500 transition-colors">
                                <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-all">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                                    <p className="text-gray-800 font-medium">9895920813</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:border-purple-500 transition-colors">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Office</p>
                                    <p className="text-gray-800 font-medium">San Francisco, CA</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:border-orange-500 transition-colors">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Hours</p>
                                    <p className="text-gray-800 font-medium">9 AM - 6 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Connect With Us</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Follow us on social media for updates, tips, and community highlights
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all group"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-600 hover:text-white transition-all group"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-600 hover:text-white transition-all group"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all group"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all group"
                            >
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Visual Element: Image with Trust Quote */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                        <img
                            src={aboutSectionImage}
                            alt="Hokz Academy Team"
                            className="w-full h-80 object-cover transition duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent flex items-end p-8">
                            <p className="text-white italic text-lg font-light">
                                "Our mission at Hokz Academy is to make high-quality education accessible to everyone,
                                everywhere."
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT COLUMN: CONTACT FORM */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100 relative"
                >
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">Send us a Message</h3>
                        <p className="text-gray-500">We'll get back to you faster than a compiler error!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Subject</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            >
                                <option value="">Select a topic</option>
                                <option value="Course Inquiry">Course Inquiry</option>
                                <option value="Technical Support">Technical Support</option>
                                <option value="Business Partnership">Business Partnership</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="How can we help you?"
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                required
                            ></textarea>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all"
                        >
                            <span>Send Message</span>
                            <Send size={18} />
                        </motion.button>
                    </form>

                    {/* Trust Seal below form */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center space-x-2 text-gray-400 text-sm">
                        <ShieldCheck size={16} className="text-green-500" />
                        <span>Your data is protected by Hokz Privacy Shield.</span>
                    </div>
                </motion.div>
            </section>

            {/* --- NEWSLETTER / CTA --- */}
            <section className="bg-white py-16 px-4 border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't miss a beat!</h2>
                    <p className="text-gray-600 mb-8">
                        Subscribe to our newsletter for the latest course updates and career tips.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-6 py-3 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-80"
                        />
                        <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
