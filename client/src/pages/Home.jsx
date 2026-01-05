import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Zap, Users, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-32 py-10">
            {/* Hero Section */}
            <section className="text-center space-y-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight text-slate-900">
                    Master New Skills. <br />
                    <span className="gradient-text">Share Your Expertise.</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    The ultimate peer-to-peer skill exchange platform. Teach what you love,
                    learn what you need, and grow your network through meaningful connections.
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-8">
                    <Link to="/browse" className="px-10 py-5 bg-primary text-white rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/30">
                        Start Learning
                    </Link>
                    <Link to="/register" className="px-10 py-5 glass rounded-full font-bold text-xl hover:bg-slate-100 transition-colors text-slate-900 border border-slate-200">
                        Join the Community
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-10">
                <div className="glass p-8 rounded-3xl space-y-4 hover:border-primary/50 transition-colors border border-white/50">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Credit System</h3>
                    <p className="text-slate-600 leading-relaxed">Earn credits by teaching others and use them to learn something new. No money involved, just knowledge.</p>
                </div>
                <div className="glass p-8 rounded-3xl space-y-4 hover:border-secondary/50 transition-colors border border-white/50">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Peer Connections</h3>
                    <p className="text-slate-600 leading-relaxed">Connect with passionate people around the world. Expand your network while expanding your mind.</p>
                </div>
                <div className="glass p-8 rounded-3xl space-y-4 hover:border-green-500/50 transition-colors border border-white/50">
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <Shield className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Verified Expertise</h3>
                    <p className="text-slate-600 leading-relaxed">Read reviews and check ratings to find the best teachers for your specific learning goals.</p>
                </div>
            </section>

            {/* Stats / Proof */}
            <section className="glass p-12 rounded-[3rem] text-center border border-white/10">
                <div className="grid md:grid-cols-3 gap-12">
                    <div>
                        <p className="text-5xl font-black gradient-text mb-2">500+</p>
                        <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">Skills Shared</p>
                    </div>
                    <div>
                        <p className="text-5xl font-black gradient-text mb-2">2k+</p>
                        <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">Active Users</p>
                    </div>
                    <div>
                        <p className="text-5xl font-black gradient-text mb-2">5k+</p>
                        <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">Sessions Completed</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
