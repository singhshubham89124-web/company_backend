import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const services = [
  "Mobile App Development",
  "Web Development",
  "School ERP Development",
  "Business Software Systems"
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', address: '', service: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to connect to server');
    }
  };

  return (
    <section id="contact" className="py-32 bg-slate-950 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-[0.4em] text-sky-400 mb-6"
            >
              Contact Us
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-8 break-words"
            >
              Start Your <br /> 
              <span className="text-slate-600 italic">Project.</span>
            </motion.h3>
            <p className="text-xl sm:text-2xl text-slate-400 font-light mb-12 max-w-lg leading-relaxed">
              Ready to transform your ideas into digital reality? Our team of specialists is just one click away.
            </p>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4 sm:gap-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-2xl sm:rounded-3xl flex items-center justify-center text-emerald-400 border border-white/10 transition-all group-hover:bg-emerald-400 group-hover:text-black shrink-0">
                  <Mail size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">System Support</div>
                  <div className="text-sm sm:text-2xl font-black text-white break-all">anibeshsingh2@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem]"
          >
            <div className="bg-slate-900 rounded-[2.9rem] p-6 sm:p-10 md:p-14 relative h-full">
              {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30 shadow-[0_0_50px_rgba(52,211,153,0.2)]"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h4 className="text-4xl font-black text-white mb-6">Transmission Received</h4>
                  <p className="text-xl text-slate-400 mb-10 max-w-sm font-light">
                    Our systems have logged your request. Our agents will reach out within 24 standard cycles.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-400 hover:text-white transition-all shadow-xl"
                  >
                    Send Another Signal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Identity</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 sm:px-8 py-5 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-white placeholder-slate-700 font-medium"
                      placeholder="Enter Full Name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Protocol</label>
                        <input
                        required
                        type="email"
                        className="w-full px-4 sm:px-8 py-5 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-white placeholder-slate-700 font-medium"
                        placeholder="hello@world.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Phone Link</label>
                        <input
                        required
                        type="tel"
                        className="w-full px-4 sm:px-8 py-5 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-white placeholder-slate-700 font-medium"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Base Address</label>
                        <input
                        required
                        type="text"
                        className="w-full px-4 sm:px-8 py-5 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-white placeholder-slate-700 font-medium"
                        placeholder="Enter location"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Service Type</label>
                        <select
                        required
                        className="w-full px-4 sm:px-8 py-5 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-white appearance-none cursor-pointer font-medium"
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        >
                        <option value="" disabled className="bg-slate-900">Select Integration</option>
                        {services.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                        </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Mission Details</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 sm:px-8 py-5 bg-black/50 border border-white/5 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-white placeholder-slate-700 resize-none font-medium"
                      placeholder="Describe the objective..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-rose-400 bg-rose-500/10 p-5 rounded-2xl text-xs font-black uppercase tracking-widest border border-rose-500/20">
                      <AlertCircle size={18} />
                      {errorMessage}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={cn(
                      "w-full py-6 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl",
                      status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-sky-400 hover:text-white'
                    )}
                  >
                    {status === 'loading' ? (
                      <div className="w-6 h-6 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        Initiate Project
                        <ArrowTopRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowTopRight({ size, className }: { size: number, className?: string }) {
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
            <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
    )
}
