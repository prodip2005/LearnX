import React from 'react';
import { Rocket } from 'lucide-react'; // Lucide react ব্যবহার করা নিরাপদ

const CTASection = () => {
  return (
    <section className="px-6 md:px-20 lg:px-40 py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-[1200px]">
        {/* Main Card with Gradient */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-primary/80 via-primary to-primary-hover px-8 py-16 md:px-20 md:py-24 shadow-2xl shadow-primary/30">
          {/* Decorative Background Circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Text Content */}
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                Ready to boost your grades and unlock your potential?
              </h2>
              <p className="text-white/80 text-lg md:text-xl font-medium">
                Join thousands of students who have already transformed their
                academic journey with LearnX.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0 w-full md:w-auto">
              {/* whitespace-nowrap ব্যবহার করা হয়েছে যাতে টেক্সট না ভাঙে */}
              <button className="group relative w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-[#f8fafc] text-primary px-8 py-5 rounded-2xl text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap">
                Join Now
                {/* Lucide icon ব্যবহার করা হয়েছে ভাল এলাইনমেন্টের জন্য */}
                <Rocket className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
