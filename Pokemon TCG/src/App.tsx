import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './components/pages/mainpage';
import Battle from './components/pages/battle';
import NavBar from './components/feature/navbar';
import Settings from './components/feature/settings';
import CreateUserModal from './components/feature/createuser';
import { User } from './components/assets/UserClass';

function App() {
    const [showSettings, setShowSettings] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Load user from localStorage on initial render
    useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                const user = new User(userData._username);
                // You might need to reconstruct other user properties here
                setCurrentUser(user);
            } catch (e) {
                console.error('Failed to parse saved user', e);
            }
        }
    });

    const handleCreateUser = (username: string) => {
        const newUser = new User(username);
        setCurrentUser(newUser);
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            _username: username
            // Add other properties you want to persist
        }));
    };

    return (
        <Router>
            <NavBar 
                onSettingsClick={() => setShowSettings(true)} 
                currentUser={currentUser} 
            />
            
            {showSettings && (
                <Settings
                    closeModal={() => setShowSettings(false)}
                    onCreateNewUser={() => {
                        setShowSettings(false);
                        setShowCreateUser(true);
                    }}
                    currentUser={currentUser}
                />
            )}
            
            {showCreateUser && (
                <CreateUserModal
                    onCreateUser={handleCreateUser}
                    onClose={() => setShowCreateUser(false)}
                />
            )}
            
            <Routes>
                <Route path="/" element={<MainPage currentUser={currentUser} />} />
                <Route path="/battle" element={<Battle currentUser={currentUser} />} />
            </Routes>
        </Router>
    );
}

export default App;