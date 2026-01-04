"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { ArrowRight, Code2, Zap, Target, Sparkles, Star, ChevronRight, Clock, Calendar } from 'lucide-react';
import { CATEGORIES, TESTIMONIALS, FEATURES, NAV_LINKS } from '@/constants/landing';
import { Category } from '@/types';

// ==================== SUB-COMPONENTS ====================
const FeatureRadio = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group">
    <div className="relative flex items-center justify-center mt-1.5 h-4 w-4">
      <div className="absolute h-2.5 w-2.5 rounded-full bg-[#2443B0] animate-pulse-soft" />
      <div className="absolute h-4 w-4 rounded-full border border-[#2443B0]/30 animate-pulse-soft delay-75" />
    </div>
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-slate-400 group-hover:text-[#2443B0] transition-colors">{icon}</span>
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500">{description}</p>
    </div>
  </label>
);

const CTAButton = ({ href, text }: { href: string; text: string }) => (
  <div className="flex items-center">
    <Link href={href} className="inline-flex items-center justify-center px-6 py-3.5 bg-[#D7FE44] text-[#1a1a1a] rounded-full font-bold text-base hover:bg-[#c4ea3d] transition-all transform hover:scale-105 active:scale-95 shadow-xl">{text}</Link>
    <button className="h-12 w-12 flex items-center justify-center bg-[#D7FE44] text-[#1a1a1a] rounded-full font-bold hover:bg-[#c4ea3d] transition-all transform hover:scale-105 active:scale-95 shadow-xl ml-[-1px]"><ArrowRight className="h-5 w-5 -rotate-45" /></button>
  </div>
);

const ReviewCard = () => (
  <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 max-w-[320px] shadow-2xl transform rotate-3">
    <div className="flex gap-1.5 mb-3">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 fill-[#D7FE44] text-[#D7FE44]" />)}</div>
    <p className="text-base text-white/90 leading-relaxed font-semibold mb-6">"Modern, elegan, dan fokus pada keterampilan nyata. Saya sangat menyukai proyek praktis dan sistemnya."</p>
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#D7FE44] to-blue-500 border-2 border-white/40 shadow-inner flex items-center justify-center font-bold text-[#1a1a1a]">JK</div>
      <div><h5 className="text-sm font-bold text-white">Jason Kim</h5><p className="text-xs text-blue-100/60 font-medium">UX Designer</p></div>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, avatar, quote, highlight, highlightColor }: typeof TESTIMONIALS[0]) => (
  <div className="flex flex-col space-y-6 w-[80vw] md:w-auto shrink-0 snap-center snap-always p-4 md:p-0 h-full">
    <div className="text-[#44fe9b] text-5xl font-serif leading-none">"</div>
    <p className="text-lg text-slate-700 leading-relaxed font-medium flex-grow">"{quote} <span style={{ backgroundColor: highlightColor }} className="px-1">{highlight}</span>"</p>
    <div className="flex items-center gap-4 pt-6 mt-auto">
      <div className="h-12 w-12 rounded-full overflow-hidden relative border-2 border-slate-100"><Image src={avatar} alt={name} fill className="object-cover" /></div>
      <div><h4 className="font-bold text-slate-900">{name}</h4><p className="text-sm text-slate-500">{role}</p></div>
    </div>
  </div>
);

const CategoryItem = ({ cat, isActive, onHover }: { cat: Category; isActive: boolean; onHover: () => void }) => (
  <div onMouseEnter={onHover} className={`group flex items-center gap-4 cursor-pointer transition-all duration-300 ${isActive ? 'translate-x-4' : 'hover:translate-x-2'}`}>
    <div className={`h-2.5 w-2.5 rounded-full border-2 border-slate-300 transition-all duration-500 ${isActive ? 'bg-[#2443B0] scale-[2] border-[#2443B0]' : 'group-hover:scale-150'}`} />
    <div className="flex items-center gap-4">
      <span className={`text-2xl md:text-lg font-semibold transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-300 group-hover:text-slate-400'}`}>{cat.title}</span>
      <span className="text-slate-300 font-medium text-base mt-2">({cat.count})</span>
    </div>
    {isActive && <div className="animate-in fade-in slide-in-from-left-4 duration-500"><ArrowRight className="h-6 w-6 text-[#2443B0] ml-2 -rotate-45" /></div>}
  </div>
);

const FeatureIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = { Code2: <Code2 className="h-4 w-4" />, Zap: <Zap className="h-4 w-4" />, Target: <Target className="h-4 w-4" />, Sparkles: <Sparkles className="h-4 w-4" /> };
  return icons[icon] || null;
};

// ==================== SECTIONS ====================
const HeroSection = () => (
  <section className="relative overflow-hidden bg-[#2443B0] text-white pt-32 pb-0 lg:pt-16 min-h-screen flex items-center">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
    <div className="container max-w-7xl mx-auto px-4 relative z-10 mt-20">
      <div className="flex flex-col items-center text-center space-y-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter max-w-4xl leading-[1.05]">Raih Karir Impian dengan<br /><span className="text-white italic">Kursus Online Terpercaya</span></h1>
        <p className="text-base md:text-lg text-blue-100/70 max-w-2xl font-light">Bergabunglah dengan ribuan pelajar di seluruh dunia yang mengakses kursus mutakhir untuk masa depan cerah.</p>
        <CTAButton href="/register" text="Buat Roadmap Kamu Sekarang!" />
      </div>
      <div className="relative max-w-[1400px] mx-auto mt-12">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] aspect-square max-w-[900px] bg-[#1a36a9] rounded-full transform translate-y-1/2 -z-10 shadow-2xl overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50" /></div>
        <div className="absolute left-0 xl:-left-12 top-1/4 hidden lg:block">
          <div className="max-w-[250px]"><div className="text-5xl font-serif text-[#D7FE44]">"</div><p className="text-md text-blue-100/60 leading-relaxed font-medium">Dari pembelajaran berbasis AI hingga proyek dunia nyata, platform kami memberdayakan Anda untuk terus belajar.</p></div>
          <div className="space-y-1 mt-4"><h4 className="text-3xl font-medium text-white">5000+</h4><p className="text-[10px] text-blue-100/50 font-bold tracking-[0.2em] uppercase">Kursus Unggulan</p></div>
        </div>
        <div className="relative z-20 flex justify-center"><Image src="/assets/hero-students.png" alt="Logo Mahasiswa Polinema" width={700} height={700} className="w-full max-w-xl h-auto object-contain relative -bottom-4 drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)] transform transition-transform duration-700" priority /></div>
        <div className="absolute right-4 xl:-right-12 top-1/4 hidden lg:block space-y-16"><ReviewCard /></div>
      </div>
    </div>
  </section>
);

const CategoriesSection = ({ activeCategory, setActiveCategory }: { activeCategory: Category; setActiveCategory: (c: Category) => void }) => (
  <section className="py-24 bg-white relative overflow-hidden min-h-[800px] flex items-center">
    <div className="container max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center space-y-2 relative z-10">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 shadow-sm">Kategori Courses</div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">Temukan Kursus yang Sesuai dengan Minat Anda <br />Lebih Baik, Lebih Cepat, & Lebih Goat 🐐.</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">Dari pembelajaran berbasis AI hingga proyek dunia nyata, platform kami memberdayakan Anda untuk terus belajar.</p>
      </div>
      <div className="relative flex justify-center mt-40">
        <div>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`absolute ${['top-[-80px] left-[3%] md:left-[1%] w-32 h-32 md:w-36 md:h-36', 'top-[-30px] right-[10%] md:right-[5%] w-36 h-40 md:w-44 md:h-56', 'bottom-[-80px] left-[6%] md:left-[4%] w-40 h-40 md:w-48 md:h-48', 'bottom-[-120px] right-[10%] md:right-[1%] w-32 h-40 md:w-40 md:h-52'][i]} rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-105 z-10`}>
              <Image src={activeCategory.images[i]} alt="cat" fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center space-y-6 relative z-20 bg-white/40 backdrop-blur-sm p-10 rounded-3xl border border-white/20">
          {CATEGORIES.map(cat => <CategoryItem key={cat.id} cat={cat} isActive={activeCategory.id === cat.id} onHover={() => setActiveCategory(cat)} />)}
        </div>
      </div>
      <div className="mt-40 flex justify-center z-30"><CTAButton href="/register" text="Jelajahi Semua Course!" /></div>
    </div>
  </section>
);

const WhyUsSection = () => (
  <section className="py-24 bg-slate-50/50">
    <div className="container max-w-7xl mx-auto px-4">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 shadow-sm">Mengapa Kami?</div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">Dirancang untuk Membantu Anda Belajar<br className="hidden md:block" />Lebih Baik, Lebih Cepat, & Lebih Cerdas 🤓.</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">Kami tidak hanya mengajar. Kami memberdayakan—dengan konten yang relevan di industri, panduan pribadi, dan alat untuk mengubah pembelajaran menjadi tindakan nyata.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
        <div className="md:col-span-4 space-y-6 flex flex-col">
          <div className="flex-1 bg-[#1a36a9] rounded-3xl p-8 text-white space-y-6 relative overflow-hidden group">
            <div className="relative z-10 space-y-4"><h3 className="text-2xl font-semibold leading-tight">Kami Memiliki Lebih dari 5rb+ Kursus</h3><p className="text-blue-100/70 text-sm leading-relaxed">Bergabunglah dengan komunitas global yang berkembang—lebih dari 100.000 pelajar dan 500+ kisah sukses.</p></div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#D7FE44] text-[#1a1a1a] rounded-full font-semibold text-sm hover:scale-105 transition-transform mt-4">Jelajahi Kursus <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="bg-[#2443B0] rounded-3xl p-8 text-white space-y-4 relative overflow-hidden group">
            <div className="flex -space-x-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-10 rounded-full border-2 border-[#2443B0] overflow-hidden relative"><Image src={`https://i.pravatar.cc/100?u=mentor${i}`} alt="Mentor" fill className="object-cover" /></div>)}<div className="h-10 w-10 rounded-full border-2 border-[#2443B0] bg-[#D7FE44] text-[#1a1a1a] flex items-center justify-center font-bold text-[10px]">200+</div></div>
            <h3 className="text-xl font-semibold leading-tight">Kami Memiliki 250+ Mentor & Pelatih Terbaik</h3>
          </div>
        </div>
        <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col group hover:shadow-lg transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2"><p className="text-[#2443B0] font-semibold text-sm uppercase tracking-wide">Tentang Kami</p><h3 className="text-3xl font-semibold text-slate-900 leading-tight">Membentuk Masa Depan <span className="text-[#2443B0]">Talenta Digital</span> Indonesia</h3></div>
              <p className="text-slate-500 text-sm leading-relaxed">Techroot adalah pionir platform edukasi teknologi yang berfokus pada hasil nyata. Kami menjembatani kesenjangan antara dunia pendidikan dan tuntutan industri melalui kurikulum berbasis proyek praktis.</p>
              <p className="text-slate-500 text-sm leading-relaxed">Misi kami adalah memberikan akses pendidikan berkualitas tinggi bagi sesiapa pun yang ingin membangun karir sukses di ekosistem teknologi yang dinamis.</p>
              <div className="pt-4 flex items-center gap-6"><div><div className="text-2xl font-semibold text-slate-900">10k+</div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lulusan</p></div><div className="w-px h-8 bg-slate-100" /><div><div className="text-2xl font-semibold text-slate-900">95%</div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tingkat Serapan Kerja</p></div></div>
            </div>
            <div className="space-y-6">
              <p className="text-[#2443B0] font-semibold text-sm uppercase tracking-wide">Fitur Unggulan</p>
              <div className="space-y-3">{FEATURES.map(f => <FeatureRadio key={f.title} title={f.title} description={f.description} icon={<FeatureIcon icon={f.icon} />} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-24 bg-white relative overflow-hidden">
    <div className="container max-w-7xl mx-auto px-4">
      <div className="text-center space-y-4 lg:mb-20 mb-5"><h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">Dengarkan Kisah Para<br />Pelajar Kami</h2></div>
      <div className="relative overflow-hidden md:overflow-visible group">
        <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide py-4 px-4 -mx-4 md:p-0 md:m-0 no-scrollbar">
          {TESTIMONIALS.map(t => <TestimonialCard key={t.name} {...t} />)}
        </div>
      </div>
    </div>
  </section>
);

const FooterSection = () => (
  <footer className="bg-white text-slate-900 pt-24 pb-12 border-t border-slate-100">
    <div className="container max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
        <div className="md:col-span-4 space-y-12">
          <div className="relative h-24 w-24 md:h-32 md:w-32 group"><Image src="/polinema.png" alt="Polinema" fill className="object-contain transition-all duration-500" /></div>
          <div><p className="text-sm font-medium text-slate-500 tracking-wide">(+62) 812-3456-7890</p><Link href="mailto:halo@techroot.id" className="text-2xl md:text-3xl font-bold tracking-tight hover:text-[#2443B0] transition-colors">halo@techroot.id</Link></div>
        </div>
        <div className="md:col-span-4 space-y-8">
          <div className="space-y-4"><h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900">Dapatkan Insight<br />Terbaru Kami</h3><p className="text-slate-500 text-sm max-w-xs leading-relaxed">Jadilah yang pertama tahu tentang perkembangan teknologi & karir digital yang relevan untuk Anda.</p></div>
          <div className="relative max-w-sm group"><input type="email" placeholder="E-mail" className="w-full bg-transparent border-b border-slate-200 py-3 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#2443B0] transition-colors" /><button className="absolute right-0 bottom-3 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#2443B0] hover:text-white transition-all"><ArrowRight className="h-4 w-4 -rotate-45" /></button></div>
        </div>
        <div className="md:col-span-4 grid grid-cols-2 gap-8 md:pl-12">
          <div className="space-y-6"><h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Menu</h4><ul className="space-y-4">{NAV_LINKS.menu.map(item => <li key={item}><Link href="#" className="text-base text-slate-600 hover:text-[#2443B0] transition-colors font-medium">{item}</Link></li>)}</ul></div>
          <div className="space-y-6"><h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Socials</h4><ul className="space-y-4">{NAV_LINKS.socials.map(item => <li key={item}><Link href="#" className="text-base text-slate-600 hover:text-[#2443B0] transition-colors font-medium">{item}</Link></li>)}</ul></div>
        </div>
      </div>
      <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-slate-400 text-sm max-w-md text-center md:text-left leading-relaxed">Di Techroot, kami melampaui sekadar platform belajar—menghadirkan pengalaman yang didukung oleh kurikulum berbasis industri untuk menghubungkan Anda dengan peluang nyata.</p>
        <div className="text-slate-900 text-sm font-bold tracking-tight">© 2025. Techroot Global. All Rights Reserved.</div>
      </div>
    </div>
  </footer>
);

// ==================== MAIN COMPONENT ====================
export default function Landing() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[1]);
  return (
    <div className="min-h-screen bg-background text-slate-900">
      <Header />
      <HeroSection />
      <CategoriesSection activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <WhyUsSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
}