import React from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-[#fdfaf5] ${className}`}>
      
      {/* Background gradient - warm neutral */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdfaf5] via-[#f3ede4] to-[#fdfaf5]"></div>

      {/* Large soft circles in warm tones */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-[#d0a26c]/10 to-[#a27850]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#a27850]/10 to-[#8c7e74]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-[#b38b5d]/10 to-[#d0a26c]/10 rounded-full blur-3xl"></div>

      {/* Additional subtle warm elements */}
      <div className="absolute top-1/6 right-1/6 w-64 h-64 bg-gradient-to-r from-[#e0c1a3]/10 to-[#d0a26c]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/6 right-1/6 w-56 h-56 bg-gradient-to-r from-[#f2d3b1]/10 to-[#d0a26c]/10 rounded-full blur-3xl"></div>

      {/* Optional subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236b4f3b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* No floating dots or bouncing icons */}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
