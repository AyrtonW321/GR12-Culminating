import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../assets/UserClass';

// current user
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// provides user state and updater function to child components
// lets any childs to access or update the current user
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// function to retrieve the current user
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used inside UserProvider');
    return context;
};
