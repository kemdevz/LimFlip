'use client';

import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function MobileClassHandler() {
  const isMobile = useIsMobile();

  useEffect(() => {
    const html = document.documentElement;
    
    if (isMobile) {
      html.classList.add('mobile');
    } else {
      html.classList.remove('mobile');
    }
  }, [isMobile]);

  return null;
}
