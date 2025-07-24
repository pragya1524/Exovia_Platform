import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-[#FFF8E7] text-[#5D4037] transition-colors duration-500 ${className}`}>
      {/* You can still keep subtle patterns or remove this if you want plain background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235D4037' fill-opacity='0.05'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
