import { Category, Testimonial, Feature } from '@/types';

export const CATEGORIES: Category[] = [
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

export const TESTIMONIALS: Testimonial[] = [
    {
        name: 'Sarah Viloid',
        role: 'Freelance Graphic Designer',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        quote: 'Dulu saya kesulitan beralih dari desain cetak ke desain digital, tapi kursus di Techroot membantu saya mengasah keterampilan UI/UX.',
        highlight: 'Sekarang, saya bekerja dengan klien dari seluruh dunia dan menikmati fleksibilitas',
        highlightColor: '#FEF9C3'
    },
    {
        name: 'Mike Tyson',
        role: 'Marketing Manager',
        avatar: 'https://i.pravatar.cc/150?u=mike',
        quote: 'Saya bekerja penuh waktu dan tidak menyangka akan punya waktu untuk belajar coding. Namun,',
        highlight: 'pelajaran singkat dan jadwal fleksibel di Techroot memungkinkan semuanya.',
        highlightColor: '#DCFCE7'
    },
    {
        name: 'Anita Chan',
        role: 'Aspiring Web Developer',
        avatar: 'https://i.pravatar.cc/150?u=anita',
        quote: 'Yang saya sukai dari Techroot adalah pendekatan praktisnya.',
        highlight: 'Kursusnya sangat interaktif, dan saya bisa langsung menerapkan',
        highlightColor: '#FCE7F3'
    }
];

export const FEATURES: Feature[] = [
    { title: 'Interactive Playground', description: 'Coding langsung di browser tanpa perlu instalasi tambahan apa pun.', icon: 'Code2' },
    { title: 'AI-Powered Feedback', description: 'Dapatkan saran dan perbaikan kode instan dari asisten AI cerdas kami.', icon: 'Zap' },
    { title: 'Custom Career Roadmap', description: 'Jalur belajar terarah yang dipersonalisasi sesuai target karir Anda.', icon: 'Target' },
    { title: 'Real-world Projects', description: 'Bangun portofolio profesional dengan mengerjakan proyek standar industri.', icon: 'Sparkles' }
];

export const NAV_LINKS = {
    menu: ['Tentang Kami', 'Kursus'],
    socials: ['LinkedIn', 'Instagram', 'YouTube']
};
