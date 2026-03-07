import CTASection from '@/components/Home/CTASection';
import FeaturesSection from '@/components/Home/FeaturesSection';
import HeroSection from '@/components/Home/HeroSection';
import React from 'react';

const HomePage = () => {
    return (
        <div>
            
            <HeroSection />
            <FeaturesSection />
            <CTASection/>
        </div>
    );
};

export default HomePage;