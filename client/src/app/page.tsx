"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { ArrowRight, Code2, Zap, Target, Sparkles, Star, Clock, Calendar, ChevronRight } from 'lucide-react';

const categories = [
  {
    id: 'design',
    title: 'Design & Creativity',
    count: '639+',
    images: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541462608141-ad60397d4bc7?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop'
    ]
  },
  {
    id: 'tech',
    title: 'Tech & Programming',
    count: '261+',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=400&auto=format&fit=crop'
    ]
  },
  {
    id: 'business',
    title: 'Business & Marketing',
    count: '1,529+',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454165833772-d99628a5ffad?q=80&w=400&auto=format&fit=crop'
    ]
  },
  {
    id: 'photography',
    title: 'Photography & Visual Arts',
    count: '975+',
    images: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493723843671-1d655e7d9742?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=400&auto=format&fit=crop'
    ]
  },
  {
    id: 'personal',
    title: 'Personal Development',
    count: '820+',
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop'
    ]
  }
];

function FeatureRadio({ title, description, icon, defaultChecked = false }: { title: string; description: string; icon: React.ReactNode; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group">
      <div className="relative flex items-center justify-center mt-1.5 h-4 w-4">
        {/* Blinking Circle Effect */}
        <div className="absolute h-2.5 w-2.5 rounded-full bg-[#2443B0] animate-pulse-soft" />
        <div className="absolute h-4 w-4 rounded-full border border-[#2443B0]/30 animate-pulse-soft delay-75" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 group-hover:text-[#2443B0] transition-colors">{icon}</span>
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500">
          {description}
        </p>
      </div>
    </label>
  );
}

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState(categories[1]);

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#2443B0] text-white pt-32 pb-0 lg:pt-16 min-h-screen flex items-center">
        {/* Blueprint Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="container max-w-7xl mx-auto px-4 relative z-10 mt-20">
          <div className="flex flex-col items-center text-center space-y-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter max-w-4xl leading-[1.05]">
              Raih Karir Impian dengan<br />
              <span className="text-white italic">Kursus Online Terpercaya</span>
            </h1>

            <p className="text-base md:text-lg text-blue-100/70 max-w-2xl font-light">
              Bergabunglah dengan ribuan pelajar di seluruh dunia yang mengakses kursus mutakhir untuk masa depan cerah.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center">
              <Link href="/register" className="inline-flex items-center justify-center px-6 py-3.5 bg-[#D7FE44] text-[#1a1a1a] rounded-full font-bold text-base hover:bg-[#c4ea3d] transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                Buat Roadmap Kamu Sekarang!
              </Link>
              <button className="h-12 w-12 flex items-center justify-center bg-[#D7FE44] text-[#1a1a1a] rounded-full font-bold hover:bg-[#c4ea3d] transition-all transform hover:scale-105 active:scale-95 shadow-xl ml-[-1px]">
                <ArrowRight className="h-5 w-5 -rotate-45" />
              </button>
            </div>
          </div>

          <div className="relative max-w-[1400px] mx-auto mt-12">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] aspect-square max-w-[900px] bg-[#1a36a9] rounded-full transform translate-y-1/2 -z-10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50"></div>
            </div>
            <div className="absolute left-0 xl:-left-12 top-1/4 hidden lg:block">
              <div className="max-w-[250px]">
                <div className="text-5xl font-serif text-[#D7FE44]">“</div>
                <p className="text-md text-blue-100/60 leading-relaxed font-medium">
                  Dari pembelajaran berbasis AI hingga proyek dunia nyata, platform kami memberdayakan Anda untuk terus belajar.
                </p>
              </div>
              <div className="space-y-1 mt-4">
                <h4 className="text-3xl font-medium text-white">5000+</h4>
                <p className="text-[10px] text-blue-100/50 font-bold tracking-[0.2em] uppercase">Kursus Unggulan</p>
              </div>
            </div>

            {/* Main Student Image */}
            <div className="relative z-20 flex justify-center">
              <Image
                src="/assets/hero-students.png"
                alt="Logo Mahasiswa Polinema"
                width={700}
                height={700}
                className="w-full max-w-xl h-auto object-contain relative -bottom-4 drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)] transform transition-transform duration-700"
                priority
              />
            </div>

            {/* Floating Elements - Right */}
            <div className="absolute right-4 xl:-right-12 top-1/4 hidden lg:block space-y-16">
              <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 max-w-[320px] shadow-2xl transform rotate-3">
                <div className="flex gap-1.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-[#D7FE44] text-[#D7FE44]" />
                  ))}
                </div>
                <p className="text-base text-white/90 leading-relaxed font-semibold mb-6">
                  "Modern, elegan, dan fokus pada keterampilan nyata. Saya sangat menyukai proyek praktis dan sistemnya."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#D7FE44] to-blue-500 border-2 border-white/40 shadow-inner flex items-center justify-center font-bold text-[#1a1a1a]">JK</div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Jason Kim</h5>
                    <p className="text-xs text-blue-100/60 font-medium">UX Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white relative overflow-hidden min-h-[800px] flex items-center">
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 shadow-sm">
              Kategori Courses
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
              Temukan Kursus yang Sesuai dengan Minat Anda <br />Lebih Baik, Lebih Cepat, & Lebih Goat 🐐.
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
              Dari pembelajaran berbasis AI hingga proyek dunia nyata, platform kami memberdayakan Anda untuk terus belajar.
            </p>
          </div>

          <div className="relative flex justify-center mt-40">
            {/* Floating Images - Brought closer to center */}
            <div >
              {/* Top Left */}
              <div className="absolute top-[-80px] left-[3%] md:left-[1%] w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-105 z-10">
                <Image src={activeCategory.images[0]} alt="cat" fill className="object-cover" />
              </div>
              {/* Top Right */}
              <div className="absolute top-[-30px] right-[10%] md:right-[5%] w-36 h-40 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-105 z-10">
                <Image src={activeCategory.images[1]} alt="cat" fill className="object-cover" />
              </div>
              {/* Bottom Left */}
              <div className="absolute bottom-[-80px] left-[6%] md:left-[4%] w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-105 z-10">
                <Image src={activeCategory.images[2]} alt="cat" fill className="object-cover" />
              </div>
              {/* Bottom Right */}
              <div className="absolute bottom-[-120px] right-[10%] md:right-[1%] w-32 h-40 md:w-40 md:h-52 rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-105 z-10">
                <Image src={activeCategory.images[3]} alt="cat" fill className="object-cover" />
              </div>
            </div>

            {/* Category List */}
            <div className="flex flex-col items-center space-y-6 relative z-20 bg-white/40 backdrop-blur-sm p-10 rounded-3xl border border-white/20">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat)}
                  className={`group flex items-center gap-4 cursor-pointer transition-all duration-300 ${activeCategory.id === cat.id ? 'translate-x-4' : 'hover:translate-x-2'}`}
                >
                  <div className={`h-2.5 w-2.5 rounded-full border-2 border-slate-300 transition-all duration-500 ${activeCategory.id === cat.id ? 'bg-[#2443B0] scale-[2] border-[#2443B0]' : 'group-hover:scale-150'}`} />
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl md:text-lg font-semibold transition-colors duration-300 ${activeCategory.id === cat.id ? 'text-slate-900' : 'text-slate-300 group-hover:text-slate-400'}`}>
                      {cat.title}
                    </span>
                    <span className="text-slate-300 font-medium text-base mt-2">({cat.count})</span>
                  </div>
                  {activeCategory.id === cat.id && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                      <ArrowRight className="h-6 w-6 text-[#2443B0] ml-2 -rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-40 flex justify-center z-30">
            <Link href="/register" className="inline-flex items-center justify-center px-6 py-3.5 bg-[#D7FE44] text-[#1a1a1a] rounded-full font-bold text-base hover:bg-[#c4ea3d] transition-all transform hover:scale-105 active:scale-95 shadow-xl">
              Jelajahi Semua Course!
            </Link>
            <button className="h-12 w-12 flex items-center justify-center bg-[#D7FE44] text-[#1a1a1a] rounded-full font-bold hover:bg-[#c4ea3d] transition-all transform hover:scale-105 active:scale-95 shadow-xl ml-[-1px]">
              <ArrowRight className="h-5 w-5 -rotate-45" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 shadow-sm">
              Mengapa Kami?
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
              Dirancang untuk Membantu Anda Belajar<br className="hidden md:block" />Lebih Baik, Lebih Cepat, & Lebih Cerdas 🤓.
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
              Kami tidak hanya mengajar. Kami memberdayakan—dengan konten yang relevan di industri, panduan pribadi, dan alat untuk mengubah pembelajaran menjadi tindakan nyata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {/* Left Column - 5k+ Courses & Mentors */}
            <div className="md:col-span-4 space-y-6 flex flex-col">
              <div className="flex-1 bg-[#1a36a9] rounded-3xl p-8 text-white space-y-6 relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-semibold leading-tight">
                    Kami Memiliki Lebih dari 5rb+ Kursus
                  </h3>
                  <p className="text-blue-100/70 text-sm leading-relaxed">
                    Bergabunglah dengan komunitas global yang berkembang—lebih dari 100.000 pelajar dan 500+ kisah sukses.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#D7FE44] text-[#1a1a1a] rounded-full font-semibold text-sm hover:scale-105 transition-transform mt-4">
                  Jelajahi Kursus <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-[#2443B0] rounded-3xl p-8 text-white space-y-4 relative overflow-hidden group">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-[#2443B0] overflow-hidden relative">
                      <Image src={`https://i.pravatar.cc/100?u=mentor${i}`} alt="Mentor" fill className="object-cover" />
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full border-2 border-[#2443B0] bg-[#D7FE44] text-[#1a1a1a] flex items-center justify-center font-bold text-[10px]">
                    200+
                  </div>
                </div>
                <h3 className="text-xl font-semibold leading-tight">
                  Kami Memiliki 250+ Mentor & Pelatih Terbaik
                </h3>
              </div>
            </div>

            {/* Middle Column - About Us & Features */}
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col group hover:shadow-lg transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-12">
                {/* About Us Description */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[#2443B0] font-semibold text-sm uppercase tracking-wide">Tentang Kami</p>
                    <h3 className="text-3xl font-semibold text-slate-900 leading-tight">
                      Membentuk Masa Depan <span className="text-[#2443B0]">Talenta Digital</span> Indonesia
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Techroot adalah pionir platform edukasi teknologi yang berfokus pada hasil nyata. Kami menjembatani kesenjangan antara dunia pendidikan dan tuntutan industri melalui kurikulum berbasis proyek praktis.
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Misi kami adalah memberikan akses pendidikan berkualitas tinggi bagi sesiapa pun yang ingin membangun karir sukses di ekosistem teknologi yang dinamis.
                  </p>
                  <div className="pt-4 flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-semibold text-slate-900">10k+</div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lulusan</p>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div>
                      <div className="text-2xl font-semibold text-slate-900">95%</div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tingkat Serapan Kerja</p>
                    </div>
                  </div>
                </div>

                {/* Features with Radio Selection */}
                <div className="space-y-6">
                  <p className="text-[#2443B0] font-semibold text-sm uppercase tracking-wide">Fitur Unggulan</p>
                  <div className="space-y-3">
                    <FeatureRadio
                      title="Interactive Playground"
                      description="Coding langsung di browser tanpa perlu instalasi tambahan apa pun."
                      icon={<Code2 className="h-4 w-4" />}
                      defaultChecked
                    />
                    <FeatureRadio
                      title="AI-Powered Feedback"
                      description="Dapatkan saran dan perbaikan kode instan dari asisten AI cerdas kami."
                      icon={<Zap className="h-4 w-4" />}
                    />
                    <FeatureRadio
                      title="Custom Career Roadmap"
                      description="Jalur belajar terarah yang dipersonalisasi sesuai target karir Anda."
                      icon={<Target className="h-4 w-4" />}
                    />
                    <FeatureRadio
                      title="Real-world Projects"
                      description="Bangun portofolio profesional dengan mengerjakan proyek standar industri."
                      icon={<Sparkles className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 lg:mb-20 mb-5">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Dengarkan Kisah Para<br />Pelajar Kami
            </h2>
          </div>

          <div className="relative overflow-hidden md:overflow-visible group">
            {/* Mobile Scrollable / Desktop Grid Container */}
            <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide py-4 px-4 -mx-4 md:p-0 md:m-0 no-scrollbar">
              {/* Testimonial 1 */}
              <div className="flex flex-col space-y-6 w-[80vw] md:w-auto shrink-0 snap-center snap-always p-4 md:p-0 h-full">
                <div className="text-[#44fe9b] text-5xl font-serif leading-none">“</div>
                <p className="text-lg text-slate-700 leading-relaxed font-medium flex-grow">
                  "Dulu saya kesulitan beralih dari desain cetak ke desain digital, tapi kursus di Techroot membantu saya mengasah keterampilan UI/UX. <span className="bg-[#FEF9C3] px-1">Sekarang, saya bekerja dengan klien dari seluruh dunia dan menikmati fleksibilitas</span> untuk belajar sesuai kecepatan saya sendiri!"
                </p>
                <div className="flex items-center gap-4 pt-6 mt-auto">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative border-2 border-slate-100">
                    <Image src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Sarah Viloid</h4>
                    <p className="text-sm text-slate-500">Freelance Graphic Designer</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex flex-col space-y-6 w-[80vw] md:w-auto shrink-0 snap-center snap-always p-4 md:p-0 h-full">
                <div className="text-[#44fe9b] text-5xl font-serif leading-none">“</div>
                <p className="text-lg text-slate-700 leading-relaxed font-medium flex-grow">
                  "Saya bekerja penuh waktu dan tidak menyangka akan punya waktu untuk belajar coding. Namun, <span className="bg-[#DCFCE7] px-1">pelajaran singkat dan jadwal fleksibel di Techroot memungkinkan semuanya.</span>"
                </p>
                <div className="flex items-center gap-4 pt-6 mt-auto">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative border-2 border-slate-100">
                    <Image src="https://i.pravatar.cc/150?u=mike" alt="Mike" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Mike Tyson</h4>
                    <p className="text-sm text-slate-500">Marketing Manager</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex flex-col space-y-6 w-[80vw] md:w-auto shrink-0 snap-center snap-always p-4 md:p-0 h-full">
                <div className="text-[#44fe9b] text-5xl font-serif leading-none">“</div>
                <p className="text-lg text-slate-700 leading-relaxed font-medium flex-grow">
                  "Yang saya sukai dari Techroot adalah pendekatan praktisnya. <span className="bg-[#FCE7F3] px-1">Kursusnya sangat interaktif, dan saya bisa langsung menerapkan</span> apa yang saya pelajari ke dalam proyek nyata secara instan."
                </p>
                <div className="flex items-center gap-4 pt-6 mt-auto">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative border-2 border-slate-100">
                    <Image src="https://i.pravatar.cc/150?u=anita" alt="Anita" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Anita Chan</h4>
                    <p className="text-sm text-slate-500">Aspiring Web Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Light Footer Section */}
      <footer className="bg-white text-slate-900 pt-24 pb-12 border-t border-slate-100">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
            {/* Left Column - Logo & Contact */}
            <div className="md:col-span-4 space-y-12">
              <div className="relative h-24 w-24 md:h-32 md:w-32 group">
                <Image
                  src="/polinema.png"
                  alt="Polinema"
                  fill
                  className="object-contain transition-all duration-500"
                />
              </div>
              <div className="">
                <p className="text-sm font-medium text-slate-500 tracking-wide">(+62) 812-3456-7890</p>
                <Link href="mailto:halo@techroot.id" className="text-2xl md:text-3xl font-bold tracking-tight hover:text-[#2443B0] transition-colors">
                  halo@techroot.id
                </Link>
              </div>
            </div>

            {/* Middle Column - Insights & Subscription */}
            <div className="md:col-span-4 space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900">
                  Dapatkan Insight<br />Terbaru Kami
                </h3>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                  Jadilah yang pertama tahu tentang perkembangan teknologi & karir digital yang relevan untuk Anda.
                </p>
              </div>
              <div className="relative max-w-sm group">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full bg-transparent border-b border-slate-200 py-3 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#2443B0] transition-colors"
                />
                <button className="absolute right-0 bottom-3 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#2443B0] hover:text-white transition-all">
                  <ArrowRight className="h-4 w-4 -rotate-45" />
                </button>
              </div>
            </div>

            {/* Right Column - Navigation Links */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8 md:pl-12">
              <div className="space-y-6">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Menu</h4>
                <ul className="space-y-4">
                  {['Tentang Kami', 'Kursus'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-base text-slate-600 hover:text-[#2443B0] transition-colors font-medium">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Socials</h4>
                <ul className="space-y-4">
                  {['LinkedIn', 'Instagram', 'YouTube'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-base text-slate-600 hover:text-[#2443B0] transition-colors font-medium">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section - Mission & Copyright */}
          <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-400 text-sm max-w-md text-center md:text-left leading-relaxed">
              Di Techroot, kami melampaui sekadar platform belajar—menghadirkan pengalaman yang didukung oleh kurikulum berbasis industri untuk menghubungkan Anda dengan peluang nyata.
            </p>
            <div className="text-slate-900 text-sm font-bold tracking-tight">
              © 2025. Techroot Global. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface CourseCardProps {
  image: string;
  title: string;
  rating: number;
  reviews: number;
  duration: string;
  date: string;
  author: string;
  authorImage: string;
  price: string;
  icon?: React.ReactNode;
}

function CourseCard({ image, title, rating, reviews, duration, date, author, authorImage, price, icon }: CourseCardProps) {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-5 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
      <div className="relative aspect-[16/11] rounded-[2rem] overflow-hidden mb-6">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {icon && (
          <div className="absolute bottom-5 left-5 h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-white/50 backdrop-blur-sm">
            {icon}
          </div>
        )}
      </div>

      <div className="px-3 space-y-5">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-400">{rating} ({reviews} Ulasan)</span>
        </div>

        <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-[#2443B0] transition-colors line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        <div className="flex items-center justify-between text-slate-500 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Clock className="h-4 w-4 text-[#2443B0]" />
            {duration}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-[#2443B0]" />
            {date}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-[#D7FE44] overflow-hidden relative">
              <Image src={authorImage} alt={author} fill className="object-cover" />
            </div>
            <span className="text-sm font-bold text-slate-800">{author}</span>
          </div>
          <div className="text-xl font-black text-[#2443B0]">
            {price}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to merge classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}