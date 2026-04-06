'use client'
import { useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { MailIcon, UserIcon, Send, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [feedback, setFeedback] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setStatus('error');
            setFeedback('Please fill in all fields.');
            return;
        }
        try {
            setStatus('sending');
            const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
            const res = await fetch(`${apiBase}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong');
            setStatus('success');
            setFeedback(data.message || 'Message sent!');
            setForm({ name: '', email: '', message: '' });
        } catch (err: any) {
            setStatus('error');
            setFeedback(err.message || 'Failed to send. Try again.');
        }
    };

    return (
        <div id="contact" className="relative px-4 md:px-16 lg:px-24 xl:px-32 py-24 overflow-hidden">
            {/* Background glowing elements */}
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <SectionTitle text1="Contact" text2="Grow Your Channel" text3="Have questions about our AI? Ready to scale your views? Let's talk." />
            
            <div className="mt-16 grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto relative z-10 text-white">
                
                {/* Left side: Contact Info */}
                <motion.div 
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    className="lg:col-span-2 flex flex-col justify-center space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
                            Let's build<br/>something amazing.
                        </h3>
                        <p className="text-zinc-400 text-base leading-relaxed">
                            Whether you need help with your current plan, want to explore enterprise options, or just want to say hi, our team is ready to assist you.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-pink-500/30 transition-colors group cursor-pointer">
                            <div className="size-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                                <MailIcon className="size-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm text-zinc-400">Email Us</p>
                                <p className="font-medium text-white/90">thumblifycommunity@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-pink-500/30 transition-colors group cursor-pointer">
                            <div className="size-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                                <MessageSquare className="size-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm text-zinc-400">Join Discord</p>
                                <p className="font-medium text-white/90">Thumblify Community</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right side: Contact Form */}
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                    className="lg:col-span-3"
                >
                    <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group/card">
                        
                        {/* Subtle Shimmer effect inside card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-transparent to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        
                        {/* Feedback banner */}
                        {status === 'success' && (
                            <div className="relative z-10 mb-6 flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-300">
                                <CheckCircle className="size-4 shrink-0" />
                                {feedback}
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="relative z-10 mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                                <AlertCircle className="size-4 shrink-0" />
                                {feedback}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-medium text-zinc-300 ml-1">Your Name</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/input:text-pink-400 transition-colors">
                                            <UserIcon className="size-5" />
                                        </div>
                                        <input 
                                            name="name" 
                                            type="text" 
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            disabled={status === 'sending'}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none focus:border-pink-500/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-pink-500/10 transition-all hover:bg-white/[0.05] disabled:opacity-50" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/input:text-pink-400 transition-colors">
                                            <MailIcon className="size-5" />
                                        </div>
                                        <input 
                                            name="email" 
                                            type="email" 
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            disabled={status === 'sending'}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none focus:border-pink-500/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-pink-500/10 transition-all hover:bg-white/[0.05] disabled:opacity-50" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-sm font-medium text-zinc-300 ml-1">Message</label>
                                <textarea 
                                    name="message" 
                                    rows={5} 
                                    placeholder="Tell us about your channel..."
                                    value={form.message}
                                    onChange={handleChange}
                                    disabled={status === 'sending'}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 outline-none focus:border-pink-500/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-pink-500/10 transition-all hover:bg-white/[0.05] resize-none disabled:opacity-50" 
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="relative mt-4 w-full sm:w-auto self-end overflow-hidden rounded-xl bg-pink-600 px-8 py-3.5 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pink-500 flex items-center justify-center border border-pink-500/50 group/submit disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                                    <Send className="size-4 transition-transform duration-300 group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1" />
                                </span>
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
