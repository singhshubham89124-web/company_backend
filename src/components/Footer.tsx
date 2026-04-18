import { Github, Twitter, Linkedin, Instagram, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2">
            <a href="#home" className="flex items-center gap-3 mb-8 w-fit group">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden transition-all group-hover:scale-110">
                <img 
                  src="/logo.png" 
                  alt="ASRVTech Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<span className="text-black font-black">A</span>';
                  }}
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">ASRVTech</span>
            </a>
            <p className="text-slate-500 max-w-sm mb-10 leading-relaxed font-light text-lg">
              Leading the digital transformation journey for enterprises worldwide. We architect high-performance ecosystems that define the next generation of technology.
            </p>
          </div>

          <div>
            <h5 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Navigation</h5>
            <div className="flex flex-col gap-5 text-slate-500 text-sm font-bold uppercase tracking-widest">
              <a href="#home" className="hover:text-sky-400 transition-colors w-fit">Home Protocol</a>
              <a href="#about" className="hover:text-sky-400 transition-colors w-fit">About Origin</a>
              <a href="#services" className="hover:text-sky-400 transition-colors w-fit">Services</a>
              <a href="#portfolio" className="hover:text-sky-400 transition-colors w-fit">Case Studies</a>
              <a href="#contact" className="hover:text-sky-400 transition-colors w-fit">Request Link</a>
            </div>
          </div>

          <div>
            <h5 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px]">Security</h5>
            <div className="flex flex-col gap-5 text-slate-500 text-sm font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-sky-400 transition-colors w-fit">Privacy Shield</a>
              <a href="#" className="hover:text-sky-400 transition-colors w-fit">Terms & Ops</a>
              <a href="#" className="hover:text-sky-400 transition-colors w-fit">Cookie Guard</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} ASRVTech Systems. All cycles reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
