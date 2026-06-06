"use client";
export default function FooterSection() {
  return (
    <section id="contact" className="bg-[#F04E00] min-h-[80vh] flex flex-col items-center justify-center px-6 text-center border-t border-neutral-900">
      <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-600 uppercase mb-6">// HAVE A PROJECT?</span>
      <h2 className="text-[clamp(3.5rem,12vw,8rem)] font-black uppercase text-white leading-none tracking-tighter mb-12">
        LET'S WORK <br />TOGETHER.
      </h2>
      <a
        href="mailto:hello@yourportfolio.dev"
        className="text-lg md:text-2xl font-medium text-white border-b border-white/20 pb-2 hover:text-[#f04e00] hover:border-[#f04e00] transition-colors duration-300"
      >
        hello@yourportfolio.dev
      </a>
    </section>
  );
}