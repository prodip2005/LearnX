import Image from 'next/image';
import React from 'react';
import { Target, Eye, Users, Award, ShieldCheck, Globe } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      title: 'Our Mission',
      description:
        'To democratize quality education by connecting students with world-class tutors through innovative technology.',
      icon: <Target size={22} />,
    },
    {
      title: 'Our Vision',
      description:
        'Building a world where geographic and economic barriers no longer prevent anyone from reaching their full potential.',
      icon: <Eye size={22} />,
    },
    {
      title: 'Our Community',
      description:
        'A thriving ecosystem of curious learners and passionate educators collaborating to achieve excellence.',
      icon: <Users size={22} />,
    },
  ];

  const features = [
    {
      title: 'Verified Tutors',
      description:
        'Every tutor undergoes a rigorous background check and qualification verification.',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      title: 'Global Reach',
      description:
        'Connect with experts from across the globe, bringing diverse perspectives to your learning.',
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: 'Proven Results',
      description:
        'Our students consistently report higher grades and increased confidence after joining LearnX.',
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <main className="flex flex-col bg-white">
      {/* Hero */}
      <section className="px-6 md:px-20 lg:px-40 pt-24 pb-20 border-b border-gray-100">
        <div className="mx-auto max-w-[1200px]">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            About LearnX
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight leading-tight max-w-3xl mb-6">
            Empowering minds,{' '}
            <span className="text-primary italic font-bold">
              changing lives.
            </span>
          </h1>
          <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed">
            LearnX is more than a platform — its a movement dedicated to making
            personalized education accessible, engaging, and effective for
            everyone.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 md:px-20 lg:px-40 py-20 border-b border-gray-100">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 px-0 md:px-10 py-8 md:py-0 first:pl-0 last:pr-0"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {value.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0f172a]">
                {value.title}
              </h3>
              <p className="text-[#64748b] text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="px-6 md:px-20 lg:px-40 py-20">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
              alt="Our Team"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] leading-snug">
              Started with a simple idea:{' '}
              <span className="text-primary italic">
                quality education for all.
              </span>
            </h2>
            <p className="text-[#64748b] leading-relaxed text-sm">
              We realized that while the world was becoming increasingly
              digital, the way we learn was still stuck in the past. We wanted
              to create a space where students could find the perfect mentor
              without being limited by their location.
            </p>

            <div className="flex flex-col gap-5 pt-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-0.5 p-2 rounded-lg border border-gray-100 text-primary shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0f172a] mb-0.5">
                      {f.title}
                    </h4>
                    <p className="text-[#64748b] text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
