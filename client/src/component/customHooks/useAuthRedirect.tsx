import { isAuthenticated } from '@/src/utils/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const useAuthRedirect = () => {
  const router = useRouter();
  // const ProtectedRoutes = ['/committee', '/members', '/designation', '/events', '/events/eventId', '/Charges', '/chat','/profile','/user-detail'];
  const ProtectedRoutes = ['/members', '/committee', '/designation', '/events', '/events/eventId', '/Charges', '/chat', '/profile', '/create-subscriptions', '/coupons', '/bank-details','/landing-cards'];
  const semiProtectedRoute = ['/user-detail', '/cart-checkout','/update-society-details']
  const pathname = usePathname();
  console.log('PPP', pathname);
  // useEffect(() => {
  //   const loggedIn = isAuthenticated();
  //   if (loggedIn && !ProtectedRoutes.includes(pathname)) {
  //     router.push('/committee');
  //   } else if (!loggedIn && ProtectedRoutes.includes(pathname)) {
  //     router.push('/signup');
  //   }
  // }, [router, pathname]);
  useEffect(() => {
    const loggedIn = isAuthenticated();
    // Check if the current route is protected
    const isProtectedRoute = ProtectedRoutes.some(route => pathname.startsWith(route));
    // const isSemiProtectedRoute = semiProtectedRoute.some(route => pathname.startsWith(route));
    console.log("useAuthRedirect", loggedIn, !isProtectedRoute)
    // If logged in and trying to access a non-protected page, redirect to '/committee'
    if (loggedIn === 'societyUser' && !isProtectedRoute
      // && !isSemiProtectedRoute
    ) {
      // router.push('/committee');
      // window.location.href = "/committee"
    }
    else if (loggedIn === 'superAdmin' && !isProtectedRoute
      // && isSemiProtectedRoute
    ) {
      // router.push('/create-subscriptions');
      // window.location.href = "/create-subscriptions"

    }
    // If not logged in and trying to access a protected page, redirect to '/signup'
    else if (loggedIn === 'guest' && isProtectedRoute
      // && isSemiProtectedRoute
    ) {
      // router.push('/signup');
      // window.location.href = "/signup"

    }
  }, [router, pathname]);
};
