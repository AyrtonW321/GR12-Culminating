import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/assets/firebaseConfig';
import './App.css';

import MainPage from './components/pages/mainpage';
import Collection from './components/pages/collection';
import Battle from './components/pages/battle';
import Profile from './components/pages/profile';
import NavBar from './components/feature/navbar';
import Store from './components/pages/store';
import Settings from './components/feature/settings';
import Login from './components/feature/Login';
import Account from './components/feature/Account';
// import { UserProvider } from './components/feature/usercontext';

interface UserData {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  wins?: number;
  losses?: number;
  currentStreak?: number;
  collectedCards?: number;
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: '', email: '', password: '' });
  const [hourglassCount, setHourglassCount] = useState<number>(12);
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize user data in local storage
  const initializeUserInLocalStorage = (firebaseUser: any, additionalData?: Partial<UserData>) => {
    const userId = firebaseUser.uid;
    const username = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
    const email = firebaseUser.email || '';
    
    const userData = {
      userId,
      username,
      email,
      password: '',
      profileImage: firebaseUser.photoURL || '/default-pfp.png',
      wins: 0,
      losses: 0,
      currentStreak: 0,
      collectedCards: 0,
      ...additionalData
    };

    // Store in local storage
    localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
    localStorage.setItem(`profileImage_${username}`, userData.profileImage);
    localStorage.setItem(`displayName_${username}`, userData.username);
    localStorage.setItem(`userEmail_${username}`, userData.email);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return userData;
  };

  // Get user data from local storage
  const getUserFromLocalStorage = (firebaseUser: any) => {
    const userId = firebaseUser.uid;
    const storedUser = localStorage.getItem(`user_${userId}`);
    
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // If not found, initialize
    return initializeUserInLocalStorage(firebaseUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      if (firebaseUser) {
        try {
          const localUserData = getUserFromLocalStorage(firebaseUser);
          
          setUserData(localUserData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error setting up user:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUserData({ username: '', email: '', password: '' });
        localStorage.removeItem('currentUser');
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleHourglassUpdate = (newAmount: number) => {
    setHourglassCount(newAmount);
  };

  const handleUserDataUpdate = (newUserData: UserData) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      
      // Update local storage
      localStorage.setItem(`user_${userId}`, JSON.stringify(newUserData));
      localStorage.setItem(`profileImage_${newUserData.username}`, newUserData.profileImage || '/default-pfp.png');
      localStorage.setItem(`displayName_${newUserData.username}`, newUserData.username);
      localStorage.setItem(`userEmail_${newUserData.username}`, newUserData.email);
      localStorage.setItem('currentUser', JSON.stringify(newUserData));
      
      // Update state
      setUserData(newUserData);
    }
  };

  if (authLoading) {
    return (
      <div className="app-loading">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
        {!isLoggedIn ? (
          <Routes>
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} initializeUserInLocalStorage={initializeUserInLocalStorage} />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            <NavBar
              onSettingsClick={() => setShowSettings(true)}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              handleSignOut={handleSignOut}
              userData={userData}
              hourglassCount={hourglassCount}
            />
            {showSettings && (
              <Settings
                closeModal={() => setShowSettings(false)}
                isLoggedIn={isLoggedIn}
                userData={userData}
                onUserDataUpdate={handleUserDataUpdate}
              />
            )}

            <Routes>
              <Route
                path="/"
                element={
                  <MainPage
                    // isLoggedIn={isLoggedIn}
                    // userData={userData}
                  />
                }
              />
              <Route
                path="/collection"
                element={
                  <Collection
                    // isLoggedIn={isLoggedIn}
                    // userData={userData}
                  />
                }
              />
              <Route
                path="/battle"
                element={
                  <Battle />
                }
              />
              <Route
                path="/store"
                element={
                  <Store
                    onHourglassUpdate={handleHourglassUpdate}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    userData={userData}
                  />
                }
              />
              <Route
                path="/account"
                element={
                  <Account
                    userData={userData}
                    setIsLoggedIn={setIsLoggedIn}
                    setUserData={setUserData}
                    onUserDataUpdate={handleUserDataUpdate}
                  />
                }
              />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        )}
    </Router>
  );
}

export default App;