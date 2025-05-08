import Cookies from 'js-cookie';
import { encryptValue } from "./encryptiondecryption";
type Society = {
  societyId: string;
  societyName: string;
};
// import
// export function isAuthenticated(): string {
//   if (typeof window === 'undefined') {
//     // Server-side rendering, so localStorage is not available
//     return 'false';
//   }
// if(window.location.pathname === '/subscriptions' || window.location.pathname === '/cart-checkout' || window.location.pathname === '/user-detail'){
//   return 'guest'
// }
//   // Client-side rendering, you can safely access localStorage
//   const token = localStorage.getItem('authToken');
//   const superAdmin = localStorage.getItem('isSuperAdmin');
//   console.log("token", !!token)
//   console.log("superAdmin", superAdmin)
//   if (!!token && !!superAdmin) {
//     return 'superAdmin'
//   }
//   else if (!!token) {
//     return 'societyUser';
//   }
//   else {
//     return 'guest';

//   }
//   // return true;
// }
export function isAuthenticated(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering, so localStorage is not available
    return 'false';
  }
  let params = new URL(document.location.toString()).searchParams;
  let name = params.get("token");
  console.log("PARAMs", params, "NAME", name)
  console.log("pathname IsAuthenticated", window.location.pathname)

  if (window.location.pathname === '/subscriptions' || window.location.pathname === '/cart-checkout' || window.location.pathname === '/user-detail') {
    return 'guest'
  }
  // Client-side rendering, you can safely access localStorage
  const token = Cookies.get('authToken');
  // const token = localStorage.getItem('authToken');
  const superAdmin = localStorage.getItem('isSuperAdmin');
  console.log("token", !!token)
  console.log("superAdmin", superAdmin)
  if (!!token && !!superAdmin) {
    return 'superAdmin'
  }
  else if (!!token || name) {
    // else if (!!token) {
    return 'societyUser';
  }
  else {
    return 'guest';

  }
  // return true;
}
export const fileToBase64 = (file: File) => {
  if (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
};


export const setSocietyIdInLocalStorage = async (society: Society): Promise<boolean> => {
  try {
    if (society) {
      const encryptedSocietyId = await encryptValue(society?.societyId); // Encrypt societyId
      localStorage.setItem('societyId', encryptedSocietyId); // Store in localStorage
      console.log("SOCIETY SET IN LOCAL IS", society);
      return true;
    }

  } catch (error) {
    console.error('Error setting societyId in localStorage:', error);
    return false;
  }
};