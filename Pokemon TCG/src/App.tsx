import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/assets/firebaseConfig';
import { User } from './components/assets/UserClass.js';
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

  // Update the initializeUserInLocalStorage function
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

    // Initialize default values if not present - NOW WITH USERNAME
    if (!localStorage.getItem(`userCoins_${username}`)) {
      localStorage.setItem(`userCoins_${username}`, '1000');
    }
    if (!localStorage.getItem(`userHourglasses_${username}`)) {
      localStorage.setItem(`userHourglasses_${username}`, '12');
    }
    if (!localStorage.getItem(`packsOpened_${username}`)) {
      localStorage.setItem(`packsOpened_${username}`, '0');
    }
    if (!localStorage.getItem(`cardsCollected_${username}`)) {
      localStorage.setItem(`cardsCollected_${username}`, '0');
    }
    if (!localStorage.getItem(`battlesWon_${username}`)) {
      localStorage.setItem(`battlesWon_${username}`, '0');
    }
    if (!localStorage.getItem(`storeVisited_${username}`)) {
      localStorage.setItem(`storeVisited_${username}`, 'false');
    }
    if (!localStorage.getItem(`profileUpdated_${username}`)) {
      localStorage.setItem(`profileUpdated_${username}`, 'false');
    }

    // Create and initialize User class instance
    const userInstance = new User(username, email, '');
    userInstance.syncHourglassesWithLocalStorage();
    localStorage.setItem("loggedInUser", JSON.stringify(userInstance.toJSON()));

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

  // Update the useEffect for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      if (firebaseUser) {
        try {
          const localUserData = getUserFromLocalStorage(firebaseUser);

          setUserData(localUserData);
          setIsLoggedIn(true);

          // Load User class and sync hourglasses
          const stored = localStorage.getItem("loggedInUser");
          if (stored) {
            const userInstance = User.fromJSON(JSON.parse(stored));
            userInstance.syncHourglassesWithLocalStorage();
            setHourglassCount(userInstance.getCurrentHourglasses());
            // Update stored user data
            localStorage.setItem("loggedInUser", JSON.stringify(userInstance.toJSON()));
          } else {
            // Fallback to localStorage
            const savedHourglasses = localStorage.getItem('userHourglasses');
            if (savedHourglasses) {
              setHourglassCount(parseInt(savedHourglasses));
            }
          }
        } catch (error) {
          console.error('Error setting up user:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUserData({ username: '', email: '', password: '' });
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loggedInUser');
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

  // Update the handleHourglassUpdate function
  const handleHourglassUpdate = (newAmount: number) => {
    setHourglassCount(newAmount);

    // Update User class if available
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      const userInstance = User.fromJSON(JSON.parse(stored));
      const currentHourglasses = userInstance.getCurrentHourglasses();
      const difference = newAmount - currentHourglasses;

      if (difference !== 0) {
        if (difference > 0) {
          userInstance.addHourglass(difference);
        } else {
          userInstance.subtractHourglass(Math.abs(difference));
        }
        localStorage.setItem("loggedInUser", JSON.stringify(userInstance.toJSON()));
      }
    } else if (userData.username) {
      // Fallback to localStorage with username
      localStorage.setItem(`userHourglasses_${userData.username}`, newAmount.toString());
    }
  };

  // Update the handleCoinsUpdate function
  const handleCoinsUpdate = (newAmount: number) => {
    if (userData.username) {
      localStorage.setItem(`userCoins_${userData.username}`, newAmount.toString());
    }
  };

  // Update the handleUserDataUpdate function
  const handleUserDataUpdate = (newUserData: UserData) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      // Update local storage
      localStorage.setItem(`user_${userId}`, JSON.stringify(newUserData));
      localStorage.setItem(`profileImage_${newUserData.username}`, newUserData.profileImage || '/default-pfp.png');
      localStorage.setItem(`displayName_${newUserData.username}`, newUserData.username);
      localStorage.setItem(`userEmail_${newUserData.username}`, newUserData.email);
      localStorage.setItem('currentUser', JSON.stringify(newUserData));

      // Mark profile as updated for missions - NOW WITH USERNAME
      localStorage.setItem(`profileUpdated_${newUserData.username}`, 'true');

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
                  onCoinsUpdate={handleCoinsUpdate}
                  onHourglassUpdate={handleHourglassUpdate}
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