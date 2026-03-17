import Image from 'next/image';
import React from 'react';

const Logo = () => {
    return (
      <div>
        <Image width={40} height={40} alt='Main Logo' src={'/mainLogo.png'} />
      </div>
    );
};

export default Logo;