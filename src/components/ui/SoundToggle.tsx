'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import MagneticButton from '@/components/motion/MagneticButton';

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(soundManager.getMuted());
  }, []);

  const handleToggle = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <MagneticButton
      onClick={handleToggle}
      className="p-2.5 rounded-full border border-white/10 hover:border-white/30 bg-[#080808]/70 backdrop-blur-md transition-colors"
      dataCursor={isMuted ? 'UNMUTE' : 'MUTE'}
    >
      <div className="flex items-center gap-2 px-1">
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-[#A1A1A1]" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#F0F0ED]" />
        )}
        <span className="font-mono-tech text-[10px] tracking-wider uppercase text-[#A1A1A1] hidden sm:inline">
          {isMuted ? 'SOUND OFF' : 'SOUND ON'}
        </span>
      </div>
    </MagneticButton>
  );
}
