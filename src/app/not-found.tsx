import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F0F0ED] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="w-full flex-grow flex flex-col items-center justify-center px-6 py-32 text-center">
        <div className="corner-bracket corner-tl !top-24 !left-8" />
        <div className="corner-bracket corner-tr !top-24 !right-8" />

        <div className="max-w-xl flex flex-col items-center">
          <span className="font-mono-tech text-xs tracking-[0.3em] uppercase text-[#777777] mb-4">
            ERR // 404_OFFLINE_CLIP
          </span>

          <h1 className="font-serif-editorial text-7xl sm:text-9xl text-[#F0F0ED] italic font-light mb-4">
            Frame Missing
          </h1>

          <div className="w-16 h-[1px] bg-white/20 my-6" />

          <p className="font-sans-body text-sm sm:text-base text-[#A1A1A1] max-w-md leading-relaxed mb-10">
            The requested timeline cut or asset sequence does not exist in this project directory.
          </p>

          <Link
            href="/"
            className="px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white hover:text-black transition-all font-mono-tech text-xs uppercase tracking-widest inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO REEL</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
