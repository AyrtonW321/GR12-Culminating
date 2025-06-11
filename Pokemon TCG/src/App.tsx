import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

    const handleSignOut = () => {
        setIsLoggedIn(false);
        setUserData({ username: '', email: '', password: '' });
        localStorage.removeItem('loggedInUser');
    };

    const handleHourglassUpdate = (newAmount: number) => {
        setHourglassCount(newAmount);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setIsLoggedIn(true);
            setUserData(JSON.parse(storedUser));
        }

        // Load hourglass count from localStorage
        const savedHourglasses = localStorage.getItem('userHourglasses');
        if (savedHourglasses) {
            setHourglassCount(parseInt(savedHourglasses));
        }
    }, []);

    if (!isLoggedIn) {
        return (
            <Router>
                <Routes>
                    <Route 
                        path="/login" 
                        element={<Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />} 
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        );
    }

    return (
        <Router>
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
                <Route path="/" element={<MainPage />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/battle" element={<Battle />} />
                <Route 
                    path="/store" 
                    element={<Store onHourglassUpdate={handleHourglassUpdate} />} 
                />
                <Route path="/profile" element={<Profile userData={userData} />} />
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
        </Router>
    );
}

export default App;