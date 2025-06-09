import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './components/pages/mainpage';
import Battle from './components/pages/battle';
import NavBar from './components/feature/navbar';
import Settings from './components/feature/settings';

function App() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <Router>
            <NavBar onSettingsClick={() => setShowSettings(true)} />
            {showSettings && (
                <Settings closeModal={() => setShowSettings(false)} />
            )}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/battle" element={<Battle />} />
            </Routes>
        </Router>
    );
}

export default App;