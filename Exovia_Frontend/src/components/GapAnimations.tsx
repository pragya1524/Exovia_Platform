import React from 'react';

const GapAnimations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Top gap animations (between header and content) */}
      <div className="absolute top-16 left-0 right-0 h-4 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-[#c49c6b]/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1 left-3/4 w-1 h-1 bg-[#a27850]/15 rounded-full animate-bounce-medium"></div>
        <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-[#e6d3b3]/10 rounded-full animate-bounce-fast"></div>
      </div>
      
      {/* Side gap animations (between sidebar and content) */}
      <div className="absolute top-0 left-64 bottom-0 w-2 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-1 h-1 bg-[#b38b5d]/15 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-0 w-0.5 h-0.5 bg-[#d2b48c]/10 rounded-full animate-bounce-medium"></div>
        <div className="absolute top-3/4 left-0 w-1.5 h-1.5 bg-[#a27850]/10 rounded-full animate-bounce-fast"></div>
      </div>
      
      {/* Bottom gap animations (above footer) */}
      <div className="absolute bottom-16 left-0 right-0 h-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/3 w-1 h-1 bg-[#d9a066]/15 rounded-full animate-bounce-medium"></div>
        <div className="absolute bottom-1 left-2/3 w-0.5 h-0.5 bg-[#e0b084]/10 rounded-full animate-bounce-fast"></div>
        <div className="absolute bottom-2 left-1/6 w-1.5 h-1.5 bg-[#c49c6b]/10 rounded-full animate-bounce-slow"></div>
      </div>
      
      {/* Corner gap animations */}
      <div className="absolute top-16 left-64 w-1 h-1 bg-gradient-to-r from-[#c49c6b]/10 to-[#a27850]/10 rounded-full animate-pulse"></div>
      <div className="absolute top-16 right-0 w-1 h-1 bg-gradient-to-r from-[#a27850]/10 to-[#d2b48c]/10 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-16 left-64 w-1 h-1 bg-gradient-to-r from-[#e6d3b3]/10 to-[#b38b5d]/10 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-16 right-0 w-1 h-1 bg-gradient-to-r from-[#d9a066]/10 to-[#e0b084]/10 rounded-full animate-pulse delay-1500"></div>
    </div>
  );
};

export default GapAnimations;
