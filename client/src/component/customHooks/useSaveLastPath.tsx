'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const useSaveLastPath = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      localStorage.setItem('lastVisitedPath', pathname);
    }
  }, [pathname]);
};

export default useSaveLastPath;
