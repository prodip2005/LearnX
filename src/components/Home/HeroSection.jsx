import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="px-6 md:px-20 lg:px-40 py-16 md:py-24 bg-[#f6f8f6]">
      <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div className="flex flex-col gap-4">
            {/* Badge */}
            <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">bolt</span>
              Academic Excellence
            </span>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-[#0f172a]">
              Master Your Exams with{' '}
              <span className="text-primary">LearnX</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-[#475569] max-w-lg leading-relaxed">
              Connect with top-rated tutors and achieve your academic goals with
              personalized one-on-one sessions tailored to your learning style.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-primary/30 transition-all flex items-center gap-2 active:scale-95">
              Get Started Today
            </button>
            <button className="bg-white border border-[#e2e8f0] text-[#0f172a] px-8 py-4 rounded-xl text-base font-bold hover:bg-[#f8fafc] transition-all active:scale-95">
              View Tutors
            </button>
          </div>

          {/* Trust Pilot / Student Proof */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-[#e2e8f0] flex items-center justify-center overflow-hidden"
                >
                  <Image
                    width={1440}
                    height={1440}
                    alt={`Student ${i + 1}`}
                    className="w-full h-full object-cover"
                    src={`https://i.pravatar.cc/150?u=${i}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-[#64748b]">
              <span className="font-bold text-[#0f172a]">10,000+</span> Students
              trust us
            </p>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="order-1 lg:order-2">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-primary/10 group">
            <Image
              width={1440}
              height={1440}
              alt="Learning Experience"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent"></div>

            {/* Success Card Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur rounded-xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <span className="material-symbols-outlined text-primary">
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">
                    95% Success Rate
                  </p>
                  <p className="text-xs text-[#64748b]">
                    In final year examinations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
