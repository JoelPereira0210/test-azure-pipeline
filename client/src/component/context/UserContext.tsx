import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchLoggedInUserdata } from '@/src/actions/auth';

// Define the shape of the user data
interface UserContextType {
    user: any; // Update with the correct type for your user data
    setUser: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// UserProvider component to fetch and provide user data
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchLoggedInUserdata();
                console.log("CONTEXT", data)
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
