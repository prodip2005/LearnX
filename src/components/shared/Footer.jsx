import { GraduationCap } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-[#94a3b8] py-12 px-6 md:px-20 lg:px-40">
      <div className="mx-auto max-w-[1200px]">
        {/* Top Border Line */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-12">
          {/* Logo Section */}
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-6xl font-bold">
              <GraduationCap size={40} strokeWidth={2} />
            </span>
            <span className="text-xl font-bold tracking-tight">LearnX</span>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 text-sm font-medium">
            <a
              className="hover:text-primary transition-colors cursor-pointer"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="hover:text-primary transition-colors cursor-pointer"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="hover:text-primary transition-colors cursor-pointer"
              href="#"
            >
              Contact Us
            </a>
          </div>

          {/* Copyright Text */}
          <p className="text-xs text-[#64748b]">
            © {new Date().getFullYear()} LearnX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
