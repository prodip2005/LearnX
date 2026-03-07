import { Star, Clock, PencilLine } from 'lucide-react';
import styles from './Features.module.css';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Expert Tutors',
      description:
        'Access a global network of certified teachers and subject matter experts vetted for quality.',
      icon: <Star size={32} />,
      delay: '0s',
    },
    {
      title: 'Flexible Timing',
      description:
        'Book sessions that fit your busy schedule, anytime, from anywhere in the world.',
      icon: <Clock size={32} />,
      delay: '0.2s',
    },
    {
      title: 'Interactive Tools',
      description:
        'Engage with digital whiteboards and real-time collaboration platforms for hands-on learning.',
      icon: <PencilLine size={32} />,
      delay: '0.4s',
    },
  ];

  return (
    <section className={styles.section}>
      {/* Background Effect */}
      <div className={styles.bgEffect}></div>

      <div className="mx-auto max-w-[1200px] relative">
        {/* Section Header */}
        <div className="mb-20 text-center flex flex-col items-center">
          <span className="text-[#1fbb32] font-bold text-sm tracking-widest uppercase mb-4">
            Our Advantages
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-[#0f172a]">
            Why Choose LearnX?
          </h2>
          <div className="w-20 h-1.5 bg-[#1fbb32] rounded-full mb-6"></div>
          <p className="text-[#475569] max-w-2xl text-lg">
            We provide the most advanced digital learning tools and personalized
            support to ensure every student reaches their full potential.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              style={{ animationDelay: feature.delay }}
              className={`bg-[#f8fafc] p-10 rounded-[2.5rem] shadow-xl border border-transparent hover:border-[#1fbb32]/20 hover:bg-white hover:shadow-2xl hover:shadow-[#1fbb32]/10 transition-all duration-500 group ${styles.floatCard}`}
            >
              {/* Icon Container */}
              <div className="w-20 h-20 rounded-[2rem] bg-[#e8f8eb] flex items-center justify-center mb-10 transition-all duration-500 shadow-sm group-hover:bg-[#1fbb32]">
                <div className="text-[#1fbb32] group-hover:text-white transition-colors duration-500 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-extrabold mb-4 text-[#0f172a] group-hover:text-[#1fbb32] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#64748b] leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
