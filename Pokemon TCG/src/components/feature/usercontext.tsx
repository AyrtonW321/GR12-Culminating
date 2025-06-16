import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../assets/firebaseConfig';
import { getParsedUserData, ParsedUserData } from '../assets/firebaseUtils';
import { PokemonCard } from '../assets/PokemonCardsClass';

interface UserContextType {
  user: ParsedUserData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  cardCollection: Map<PokemonCard, number>;
  refreshUserData: () => Promise<void>;
  firebaseUser: FirebaseUser | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ParsedUserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardCollection, setCardCollection] = useState<Map<PokemonCard, number>>(new Map());

  const refreshUserData = async () => {
    if (!firebaseUser) {
      setUser(null);
      setCardCollection(new Map());
      return;
    }

    try {
      setError(null);
      const userData = await getParsedUserData(firebaseUser.uid);
      
      if (userData) {
        setUser(userData);
        setCardCollection(userData.cardCollection);
      } else {
        setError('Failed to load user data');
        setUser(null);
        setCardCollection(new Map());
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError('Failed to refresh user data');
      setUser(null);
      setCardCollection(new Map());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setIsLoading(true);
      setFirebaseUser(authUser);
      
      if (authUser) {
        setIsLoggedIn(true);
        await refreshUserData();
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setCardCollection(new Map());
        setError(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh user data when firebaseUser changes
  useEffect(() => {
    if (firebaseUser && isLoggedIn) {
      refreshUserData();
    }
  }, [firebaseUser]);

  const contextValue: UserContextType = {
    user,
    isLoggedIn,
    isLoading,
    error,
    cardCollection,
    refreshUserData,
    firebaseUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};