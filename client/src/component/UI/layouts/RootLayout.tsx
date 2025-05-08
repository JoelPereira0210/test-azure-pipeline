// 'use client'; // Ensure this file is client-side only

// import { useEffect, useState } from 'react';
// import AuthenticatedLayout from '@/src/component/UI/layouts/AuthenticatedLayout';
// import UnauthenticatedLayout from '@/src/component/UI/layouts/UnauthenticatedLayout';
// import { isAuthenticated } from '@/src/utils/auth';
// import { Toaster } from 'react-hot-toast';
// import SuperAdminLayout from './SuperAdminLayout';

// export default function ClientRootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [isClient, setIsClient] = useState(false);
//   const [authenticated, setAuthenticated] = useState('');
//   useEffect(() => {
//     console.log('KKK');
//     // Ensure this code only runs on the client
//     setIsClient(true);
//     setAuthenticated(isAuthenticated());
//   }, []);

//   if (!isClient) {
//     return null; // or show a loading spinner
//   }

//   console.log("check isAUth",authenticated);
//   const SelectedLayout = authenticated === 'societyUser'
//     ? AuthenticatedLayout
//     : (authenticated === 'superAdmin' ? SuperAdminLayout : UnauthenticatedLayout);

//   return <><SelectedLayout>{children}</SelectedLayout></>;
// }
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/src/component/UI/layouts/AuthenticatedLayout';
import UnauthenticatedLayout from '@/src/component/UI/layouts/UnauthenticatedLayout';
import SuperAdminLayout from './SuperAdminLayout';
import { isAuthenticated } from '@/src/utils/auth';
import { Toaster } from 'react-hot-toast';
import { setRoleAction } from '@/src/actions/auth';

const useSaveLastPath = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname !== '/') {
      localStorage.setItem('lastVisitedPath', pathname);
    }
  }, [pathname]);
};

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [authStatus, setAuthStatus] = useState<'societyUser' | 'superAdmin' | ''>('');
  const router = useRouter();

  useSaveLastPath();

  useEffect(() => {
    setIsClient(true); // Ensure this only runs client-side

    const status: any = isAuthenticated();
    setAuthStatus(status);

    const lastVisitedPath = localStorage.getItem('lastVisitedPath');
    const role = localStorage.getItem('flow');
    if (!role) {
      setRoleAction();
    }
    if (
      lastVisitedPath &&
      lastVisitedPath !== window.location.pathname &&
      !window.location.pathname.startsWith('/_error') // Prevent redirect loops on invalid routes
    ) {
      router.replace(lastVisitedPath);
    }
  }, [router]);

  if (!isClient) {
    return null; // Optionally render a loader or fallback here
  }

  const LayoutComponent =
    authStatus === 'societyUser'
      ? AuthenticatedLayout
      : authStatus === 'superAdmin'
        ? SuperAdminLayout
        : UnauthenticatedLayout;

        console.log("authStatus",authStatus);
  return (
    <>
      <Toaster />
      <LayoutComponent>{children}</LayoutComponent>
    </>
  );
}
