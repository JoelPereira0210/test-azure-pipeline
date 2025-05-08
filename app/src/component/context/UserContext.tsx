// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// /* import { fetchLoggedInUserdata } from '@/src/actions/auth';
//  */
// // Define the shape of the user data (replace `any` with actual type if known)
// interface User {
//     id: string;
//     name: string;
//     email: string;
//     // Add other user properties here
// }

// // Define the UserContext type
// interface UserContextType {
//     user: User | null;
//     setUser: React.Dispatch<React.SetStateAction<User | null>>;
//     loading: boolean;
// }

// // Create the UserContext with an initial undefined value
// const UserContext = createContext<UserContextType | undefined>(undefined);

// // Custom hook to use the UserContext
// export const useUser = (): UserContextType => {
//     const context = useContext(UserContext);
//     if (!context) {
//         throw new Error('useUser must be used within a UserProvider');
//     }
//     return context;
// };

// // Define props type for the provider
// interface UserProviderProps {
//     children: ReactNode;
// }

// // UserProvider component to fetch and provide user data
// export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);

//     /* useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await fetchLoggedInUserdata();
//                 console.log("CONTEXT", data);
//                 setUser(data);
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []); */

//     return (
//         <UserContext.Provider value={{ user, setUser, loading }}>
//             {children}
//         </UserContext.Provider>
//     );
// };


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchLoggedInUserdata } from '../../actions/auth';

// Define the shape of the user data
interface User {
    firstName(firstName: any): unknown;
    lastName?(lastName: any): unknown;
    phoneNumber?: string;
    id: string;
    name: string;
    email: string;
    societyId?: string; // Optional property if needed
    userId?: string;
    // Add other user properties here
}

// Define the UserContext type
interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
   
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Define props type for the provider
interface UserProviderProps {
    children: ReactNode;
}

// UserProvider component to fetch and provide user data
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("user contexted called");
                const data: User = await fetchLoggedInUserdata(); // Ensure data matches the User type
                console.log("User Context Data:", data);
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
