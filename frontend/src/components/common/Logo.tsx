interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <svg 
      viewBox="0 0 100 150" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main document shape (full view, no padding) */}
      <rect 
        className="fill-blue-200 dark:fill-white" 
        x="0" 
        y="0" 
        width="100" 
        height="150" 
        rx="5"
      />
      
      {/* Document lines (resume lines) */}
      <line 
        x1="12.5" 
        y1="25" 
        x2="62.5" 
        y2="25" 
        stroke="#2563eb" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <line 
        x1="12.5" 
        y1="43.75" 
        x2="87.5" 
        y2="43.75" 
        stroke="#2563eb" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        opacity="0.6"
      />
      <line 
        x1="12.5" 
        y1="56.25" 
        x2="81.25" 
        y2="56.25" 
        stroke="#2563eb" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        opacity="0.6"
      />
      <line 
        x1="12.5" 
        y1="68.75" 
        x2="87.5" 
        y2="68.75" 
        stroke="#2563eb" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        opacity="0.6"
      />
      
      {/* AI brain/neural network overlay */}
      <g transform="translate(50, 105)">
        {/* Central node */}
        <circle cx="0" cy="0" r="10" fill="#2563eb"/>
        
        {/* Neural connections */}
        <line x1="0" y1="0" x2="-25" y2="-18.75" stroke="#2563eb" strokeWidth="2.5" opacity="0.8"/>
        <line x1="0" y1="0" x2="25" y2="-18.75" stroke="#2563eb" strokeWidth="2.5" opacity="0.8"/>
        <line x1="0" y1="0" x2="-18.75" y2="18.75" stroke="#2563eb" strokeWidth="2.5" opacity="0.8"/>
        <line x1="0" y1="0" x2="18.75" y2="18.75" stroke="#2563eb" strokeWidth="2.5" opacity="0.8"/>
        
        {/* Outer nodes */}
        <circle cx="-25" cy="-18.75" r="6.25" fill="#2563eb" opacity="0.9"/>
        <circle cx="25" cy="-18.75" r="6.25" fill="#2563eb" opacity="0.9"/>
        <circle cx="-18.75" cy="18.75" r="6.25" fill="#2563eb" opacity="0.9"/>
        <circle cx="18.75" cy="18.75" r="6.25" fill="#2563eb" opacity="0.9"/>
        
        {/* Smaller connecting nodes */}
        <circle cx="-37.5" cy="-25" r="3.75" fill="#2563eb" opacity="0.6"/>
        <circle cx="37.5" cy="-25" r="3.75" fill="#2563eb" opacity="0.6"/>
        <line x1="-25" y1="-18.75" x2="-37.5" y2="-25" stroke="#2563eb" strokeWidth="2" opacity="0.5"/>
        <line x1="25" y1="-18.75" x2="37.5" y2="-25" stroke="#2563eb" strokeWidth="2" opacity="0.5"/>
      </g>
      
      {/* Accent corner fold (document detail) */}
      <path 
        className="fill-blue-300 dark:fill-gray-200" 
        d="M 87.5 0 L 87.5 12.5 L 100 12.5 Z"
      />
      <line x1="87.5" y1="12.5" x2="100" y2="12.5" stroke="#2563eb" strokeWidth="1.25" opacity="0.4"/>
      <line x1="87.5" y1="0" x2="87.5" y2="12.5" stroke="#2563eb" strokeWidth="1.25" opacity="0.4"/>
    </svg>
  );
};