"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { ArrowRight, Code2, Zap, Target, Sparkles, Star, Clock, Calendar, ChevronRight } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-background">
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
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#D7FE44] to-yellow-500 border-2 border-white/40 shadow-inner flex items-center justify-center font-bold text-[#1a1a1a]">JK</div>
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

      {/* Why Us Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 shadow-sm">
              Mengapa Kami?
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
              Dirancang untuk Membantu Anda Belajar<br className="hidden md:block" />Lebih Baik, Lebih Cepat, & Lebih Cerdas.
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
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#D7FE44] text-[#1a1a1a] rounded-full font-semibold text-sm hover:scale-105 transition-transform mt-4">
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

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-[#2443B0]" />
              <span className="text-xl font-black tracking-tight">Techroot</span>
            </div>
            <nav className="flex gap-8 text-sm font-semibold text-slate-500">
              <Link href="#" className="hover:text-[#2443B0]">Beranda</Link>
              <Link href="#" className="hover:text-[#2443B0]">Kursus</Link>
              <Link href="#" className="hover:text-[#2443B0]">Tentang Kami</Link>
              <Link href="#" className="hover:text-[#2443B0]">Kontak</Link>
            </nav>
            <div className="text-slate-400 text-sm font-medium">
              © 2025 Techroot. Hak Cipta Dilindungi.
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