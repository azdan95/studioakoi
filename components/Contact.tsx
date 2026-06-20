"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import CornerFrame from "./CornerFrame";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once:true, margin:"-100px" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 900);
  };

  const inputStyle = {
    background:"var(--background)",
    border:"1px solid var(--border)",
    color:"var(--text-primary)",
  };

  const focusStyle = "var(--accent)";
  const blurStyle  = "var(--border)";

  return (
    <section id="contact" ref={ref} className="py-24 md:py-32 border-t" style={{borderColor:"var(--border)"}}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <motion.p initial={{opacity:0,y:10}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.5}}
            className="text-xs tracking-[0.25em] uppercase mb-4" style={{color:"var(--accent)"}}>Contact</motion.p>
          <motion.h2 initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.1,duration:0.6}}
            className="font-[family-name:var(--font-space)] text-4xl md:text-5xl font-bold leading-tight mb-8" style={{color:"var(--text-primary)"}}>
            Let&apos;s build something together.
          </motion.h2>
          <motion.p initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.2,duration:0.6}}
            className="text-sm leading-relaxed mb-10" style={{color:"var(--text-secondary)"}}>
            Open to freelance projects, full-time roles, and design collaborations across the Maldives and beyond.
          </motion.p>

          <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.3,duration:0.6}} className="space-y-4">
            {[
              { icon:Mail,   label:"Email",    value:"azdan95@gmail.com" },
              { icon:Phone,  label:"Phone",    value:"+64 272 763 186" },
              { icon:MapPin, label:"Location", value:"Malé, Maldives" },
            ].map(({ icon:Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-sm border"
                  style={{background:"var(--surface-1)", borderColor:"var(--border)"}}>
                  <Icon size={16} style={{color:"var(--accent)"}} />
                </div>
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase" style={{color:"var(--text-muted)"}}>{label}</p>
                  <p className="text-sm" style={{color:"var(--text-secondary)"}}>{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.45,duration:0.6}}
            className="mt-10 pt-8 border-t" style={{borderColor:"var(--border)"}}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs tracking-[0.1em] uppercase" style={{color:"var(--text-muted)"}}>Available for work</span>
            </div>
            <p className="text-xs" style={{color:"var(--text-muted)"}}>Currently accepting new projects in Malé and remote engagements.</p>
          </motion.div>
        </div>

        <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:0.2,duration:0.7,ease:[0.22,1,0.36,1]}}>
          <CornerFrame className="p-6 md:p-8" size={18}>
          {sent ? (
            <div className="h-full flex items-center justify-center rounded-sm p-10 text-center border"
              style={{borderColor:"var(--border)", background:"var(--surface-1)"}}>
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{background:"rgba(234,92,31,0.1)", border:"1px solid rgba(234,92,31,0.3)"}}>
                  <Send size={20} style={{color:"var(--accent)"}} />
                </div>
                <h3 className="font-[family-name:var(--font-space)] text-xl font-semibold mb-2" style={{color:"var(--text-primary)"}}>Message sent</h3>
                <p className="text-sm" style={{color:"var(--text-secondary)"}}>Thank you — I'll be in touch soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id:"name",  label:"Name",  type:"text",  placeholder:"Your name" },
                { id:"email", label:"Email", type:"email", placeholder:"your@email.com" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs tracking-[0.1em] uppercase mb-2" style={{color:"var(--text-muted)"}}>{label}</label>
                  <input id={id} type={type} placeholder={placeholder} required
                    className="w-full px-4 py-3 text-sm outline-none rounded-sm"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = focusStyle}
                    onBlur={e  => e.target.style.borderColor = blurStyle}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block text-xs tracking-[0.1em] uppercase mb-2" style={{color:"var(--text-muted)"}}>Message</label>
                <textarea id="message" rows={5} placeholder="Tell me about your project..." required
                  className="w-full px-4 py-3 text-sm outline-none rounded-sm resize-none"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = focusStyle}
                  onBlur={e  => e.target.style.borderColor = blurStyle}
                />
              </div>
              <motion.button type="submit" disabled={sending}
                whileHover={sending ? undefined : {scale:1.02}} whileTap={sending ? undefined : {scale:0.98}}
                className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-medium tracking-[0.15em] uppercase rounded-sm cursor-pointer transition-opacity disabled:opacity-75 disabled:cursor-wait"
                style={{background:"var(--accent)", color:"#fff"}}>
                {sending ? (<>Sending <Loader2 size={14} className="animate-spin" /></>) : (<>Send message <Send size={14} /></>)}
              </motion.button>
            </form>
          )}
          </CornerFrame>
        </motion.div>
      </div>
    </section>
  );
}
