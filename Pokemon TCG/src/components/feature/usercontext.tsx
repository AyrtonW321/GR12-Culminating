import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../assets/firebaseConfig';
import { ParsedUserData, getParsedUserData } from '../assets/firebaseUtils';
import { onAuthStateChanged } from 'firebase/auth';

interface UserContextProps {
  user: ParsedUserData | null;
  cardCollection: Map<any, number>;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  cardCollection: new Map(),
  isLoggedIn: false,
  isLoading: true,
  error: null,
  refreshUserData: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ParsedUserData | null>(null);
  const [cardCollection, setCardCollection] = useState<Map<any, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (uid: string) => {
    try {
      const parsed = await getParsedUserData(uid);
      if (parsed) {
        setUser(parsed);
        setCardCollection(parsed.cardCollection);
        setIsLoggedIn(true);
        setError(null);
      } else {
        setUser(null);
        setCardCollection(new Map());
        setIsLoggedIn(false);
        setError('User data not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await fetchUserData(currentUser.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setCardCollection(new Map());
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, cardCollection, isLoggedIn, isLoading, error, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
