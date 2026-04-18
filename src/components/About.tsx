import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const stats = [
  { label: "Experience", value: "5", suffix: " Months" },
  { label: "Projects Done", value: "10", suffix: "+" },
  { label: "Live Apps", value: "3", suffix: "" }
];

export function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section id="about" ref={containerRef} className="py-32 bg-slate-950 overflow-hidden">
      <motion.div 
        style={{ opacity, scale }}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="relative z-10">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-sky-500 mb-8">About ASRVTech</h2>
              <h3 className="text-3xl md:text-6xl font-black text-white leading-tight mb-10 break-words">
                Pioneering <br /> 
                <span className="text-slate-600 italic">Software Frontiers.</span>
              </h3>
              <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed mb-12">
                ASRVTech is a modern software development company focused on building high-performance applications, ERP systems, and scalable backend solutions. We prioritize speed, security, and exceptional user experience.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-4xl font-black text-white mb-2"
                    >
                        {stat.value}{stat.suffix}
                    </motion.div>
                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, rotateY: 30 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block perspective-1000"
          >
            <div className="relative group perspective">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700">
                    <img 
                      src="https://picsum.photos/seed/asrvtech-about/800/800" 
                      alt="Digital Innovation" 
                      className="w-full aspect-square object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 mix-blend-overlay" />
                </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
