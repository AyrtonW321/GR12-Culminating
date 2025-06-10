import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainPage from './components/pages/mainpage';
import Collection from './components/pages/collection';
import Battle from './components/pages/battle';
import Profile from './components/pages/profile';
import NavBar from './components/feature/navbar';
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

    const handleSignOut = () => {
        setIsLoggedIn(false);
        setUserData({ username: '', email: '', password: '' });
        localStorage.removeItem('loggedInUser');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setIsLoggedIn(true);
            setUserData(JSON.parse(storedUser));
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
                <Route path="/store" element={<MainPage />} />
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