import React from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

interface IconMarqueeProps {
  speed?: number;      // seconds for one full loop
  iconSize?: number;
  className?: string;
}

export default function IconMarquee({
  speed = 15,
  iconSize = 40,
  className = '',
}: IconMarqueeProps) {
  const icons = [
    { Icon: Github, color: '#333', href:'https://github.com/Rahul1038402/'},
    { Icon: Linkedin, color: '#0077B5', href:'https://www.linkedin.com/in/rahul-malll-85989327b/'},
    { Icon: Instagram, color: '#E4405F', href: 'https://www.instagram.com/ig__rahul70/'},
    { Icon: Mail, color: '#EA4335',href: 'mailto:rahul1038402@gmail.com'},
  ];

  // duplicate once for seamless loop
  const doubled = [...icons, ...icons];

  return (
    <div className={`relative w-full max-w-xs sm:max-w-md mx-auto overflow-hidden group flex h-24 ${className}`}>
      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent dark:from-black z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent dark:from-black z-10" />

      <div
        className="marquee-track flex items-center gap-14 w-max will-change-transform group-hover:[animation-play-state:paused]"
        style={{ ['--duration' as any]: `${speed}s` }}
      >
        {doubled.map((iconData, i) => (
          <div
            key={i}
            className="flex-none flex items-center justify-center transition-transform duration-300 hover:scale-125"
            style={{ 
              width: 64, 
              color: iconData.color 
            }}
          >
            <a href={iconData.href} target="_blank" rel="noopener noreferrer">
              <iconData.Icon size={iconSize} />
            </a>
          </div>
        ))}
      </div>

      <style>{`
        /* Seamless marquee: content duplicated -> slide half the width */
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track {
          animation: marquee var(--duration) linear infinite;
        }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}