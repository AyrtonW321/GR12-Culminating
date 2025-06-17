import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/assets/firebaseConfig';
import { userExists, initializeNewUser, getUserProfile } from './components/assets/firebaseUtils';
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
import { UserProvider } from './components/feature/usercontext';

interface UserData {
  username: string;
  email: string;
  password: string;
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ username: '', email: '', password: '' });
  const [hourglassCount, setHourglassCount] = useState<number>(0);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      if (firebaseUser) {
        try {
          const exists = await userExists(firebaseUser.uid);
          if (!exists) {
            await initializeNewUser(firebaseUser.uid, {
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              pfp: firebaseUser.photoURL || ''
            });
          }

          const profileData = await getUserProfile(firebaseUser.uid);
          if (profileData) {
            setUserData({
              username: profileData.username,
              email: profileData.email,
              password: ''
            });
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error setting up user:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUserData({ username: '', email: '', password: '' });
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleHourglassUpdate = (newAmount: number) => {
    setHourglassCount(newAmount);
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
      <UserProvider>
        {!isLoggedIn ? (
          <Routes>
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />}
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
              />
            )}

            <Routes>
              <Route
                path="/"
                element={
                  <MainPage
                    isLoggedIn={isLoggedIn}
                  />
                }
              />
              <Route
                path="/collection"
                element={
                  <Collection
                    isLoggedIn={isLoggedIn}
                  />
                }
              />
              <Route path="/battle" element={<Battle />} />
              <Route
                path="/store"
                element={<Store onHourglassUpdate={handleHourglassUpdate} />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/account"
                element={
                  <Account
                    userData={userData}
                    setIsLoggedIn={setIsLoggedIn}
                    setUserData={setUserData}
                  />
                }
              />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

export default App;
