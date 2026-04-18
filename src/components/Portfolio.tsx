import { motion } from 'motion/react';
import { ExternalLink, Smartphone, Globe, Code2, Database } from 'lucide-react';

const projects = [
  {
    name: "Cubbit",
    type: "Social Media Platform",
    description: "Cubbit is a social media platform where you can simply create a community, talk to your friends, and explore world-wide communities.",
    image: "/public/cubbit.png",
    fallback: "https://picsum.photos/seed/recharge-tech/800/600",
    link: "https://cubbit-web.onrender.com/",
    tags: ["Flutter", "Firebase", "Database"],
    status: "Live",
    highlight: true
  },
  {
    name: "MyTask",
    type: "Personal Task Manager",
    description: "Advanced productivity tool helping users manage tasks, track progress and optimize workflow.",
    image: "/public/mytask.png",
    fallback: "https://picsum.photos/seed/task-tech/800/600",
    link: "https://mytask25.netlify.app/",
    tags: ["Flutter", "Firebase", "Database"],
    status: "Live",
    highlight: true
  }
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-sky-400 font-bold uppercase tracking-[0.3em] text-sm mb-4"
            >
                Portfolio
            </motion.h2>
            <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-6xl font-black text-white leading-tight break-words"
            >
                Case Studies <br />
                <span className="text-slate-600">Our Digital Masterpieces.</span>
            </motion.h3>
          </div>
          <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/5 border border-white/10 text-white text-[10px] sm:text-sm font-bold uppercase tracking-widest">10 Projects Completed</div>
              <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] sm:text-sm font-bold uppercase tracking-widest">3 Live Apps</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx % 3 * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-900 mb-6 border border-white/5 shadow-2xl transition-all group-hover:border-sky-500/50 group-hover:translate-y-[-8px]">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = project.fallback;
                  }}
                />
                
                {project.status === 'Live' && (
                    <div className="absolute top-6 right-6">
                        <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Live Project
                        </span>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-white/10 px-2 py-1 rounded border border-white/5">{tag}</span>
                        ))}
                    </div>
                </div>
              </div>

              <div className="px-4">
                <h4 className="text-2xl font-black text-white mb-2 flex items-center justify-between">
                    {project.name}
                    {project.link !== '#' && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400">
                            <ExternalLink size={18} />
                        </a>
                    )}
                </h4>
                <div className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-4">{project.type}</div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 h-12 overflow-hidden">
                    {project.description}
                </p>
                
                <div className="flex gap-4">
                    {project.link !== '#' && (
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-black uppercase tracking-[0.2em] text-white hover:text-sky-400 flex items-center gap-2"
                        >
                            Visit Project
                            <ArrowRight size={14} />
                        </a>
                    )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    )
}
