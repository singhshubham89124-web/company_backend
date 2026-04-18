import { motion } from 'motion/react';
import { HeroScene } from './animations/HeroScene';
import { ArrowRight, Zap, Trophy, Rocket } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-950 text-white">
      <HeroScene />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <h1 className="hero-text text-3xl sm:text-6xl md:text-8xl font-black mb-6 leading-tight break-words">
          ASRVTech <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600">
            Innovative Software
          </span>
        </h1>

        <p className="hero-text text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light px-4">
          Building powerful web applications, mobile apps, and enterprise systems that define the next generation of digital excellence.
        </p>

        <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#portfolio"
            className="group px-10 py-5 bg-white text-black rounded-full font-bold text-lg flex items-center gap-2 hover:bg-sky-400 hover:text-white transition-all shadow-2xl shadow-white/5"
          >
            View Projects
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            className="px-10 py-5 bg-transparent border border-white/20 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
          >
            Request Service
          </a>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 border-t border-white/10 pt-12">
            <div className="hero-text">
                <div className="text-4xl font-black text-white mb-2">10+</div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Projects Done</div>
            </div>
            <div className="hero-text">
                <div className="text-4xl font-black text-white mb-2">5+</div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Months Exp</div>
            </div>
            <div className="hero-text">
                <div className="text-4xl font-black text-white mb-2">3</div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Live Apps</div>
            </div>
        </div>
      </div>

      {/* Radial Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_80%)] pointer-events-none" />
    </section>
  );
}
