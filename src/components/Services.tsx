import { motion } from 'motion/react';
import { Globe, Smartphone, GraduationCap, Building2, Terminal, Figma } from 'lucide-react';
import { cn } from '../lib/utils';

const services = [
  {
    icon: <Globe className="text-sky-400" size={32} />,
    title: "Web Development",
    description: "Building modern, scalable, and high-performance websites using the latest technology stacks.",
    accent: "group-hover:text-sky-400"
  },
  {
    icon: <Smartphone className="text-emerald-400" size={32} />,
    title: "Mobile App Development",
    description: "Crafting beautiful iOS and Android experiences with React Native and native excellence.",
    accent: "group-hover:text-emerald-400"
  },
  {
    icon: <Building2 className="text-amber-400" size={32} />,
    title: "ERP System Development",
    description: "Streamlining enterprise operations with custom, data-driven ERP solutions tailored for efficiency.",
    accent: "group-hover:text-amber-400"
  },
  {
    icon: <Terminal className="text-purple-400" size={32} />,
    title: "Backend Development",
    description: "Designing robust server-side architectures that scale effortlessly and handle massive data.",
    accent: "group-hover:text-purple-400"
  }
];

export function Services() {
  return (
    <section id="services" className="py-32 bg-slate-900 overflow-hidden relative">
        {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-6"
          >
            Digital Services
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-7xl font-black text-white mb-8 break-words"
          >
            Technical <br /> <span className="text-slate-600">Specialization.</span>
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] transition-all hover:bg-slate-800"
            >
              <div className="bg-slate-950 p-12 rounded-[2.4rem] h-full flex flex-col items-start text-left">
                <div className="mb-10 p-5 rounded-3xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h4 className={cn("text-3xl font-black text-white mb-6 transition-colors", service.accent)}>
                    {service.title}
                </h4>
                <p className="text-xl text-slate-400 leading-relaxed font-light mb-auto">
                    {service.description}
                </p>
                
                <div className="mt-12 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/50 transition-colors">
                        <Plus className="text-white" size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Learn More</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Plus({ size, className }: { size: number, className?: string }) {
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
            <path d="M12 5v14M5 12h14" />
        </svg>
    )
}
