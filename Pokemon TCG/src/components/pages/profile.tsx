import { useState, useEffect } from 'react';
import { UserStats } from '../assets/UserStatsClass';
import './profile.css';

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface ProfileProps {
    userData?: UserData;
}

const Profile = ({ userData }: ProfileProps) => {
    const [displayName, setDisplayName] = useState<string>('PokemonTrainer');
    const [userStats, setUserStats] = useState<UserStats>(new UserStats());
    const [collectedCards, setCollectedCards] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>('/default-pfp.png');
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        if (userData) {
            const storedDisplayName = localStorage.getItem(`displayName_${userData.username}`) || userData.username;
            const storedProfileImage = localStorage.getItem(`profileImage_${userData.username}`) || '/default-pfp.png';
            const storedEmail = localStorage.getItem(`userEmail_${userData.username}`) || userData.email;
            const storedStats = localStorage.getItem(`userStats_${userData.username}`);
            const storedCards = localStorage.getItem(`collectedCards_${userData.username}`);
            
            setDisplayName(storedDisplayName);
            setProfileImage(storedProfileImage);
            setEmail(storedEmail);
            setCollectedCards(storedCards ? parseInt(storedCards) : 0);
            
            if (storedStats) {
                const stats = JSON.parse(storedStats);
                setUserStats(new UserStats(stats.wins, stats.losses, stats.currentStreak));
            } else {
                const loadedStats = new UserStats(1, 1, 1);
                setUserStats(loadedStats);
            }
        }
    }, [userData]);

    const saveStatsToStorage = () => {
        if (userData) {
            localStorage.setItem(`userStats_${userData.username}`, JSON.stringify({
                wins: userStats.wins,
                losses: userStats.losses,
                currentStreak: userStats.currentStreak
            }));
            localStorage.setItem(`collectedCards_${userData.username}`, collectedCards.toString());
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="pfp-container">
                    <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="profile-image"
                    />
                </div>

                <div className="username-section">
                    <div className="username-display">
                        <h2>{displayName}</h2>
                        <p className="user-email">{email}</p>
                    </div>
                </div>
            </div>

            <div className="stats-container">
                <h3>Battle Stats</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{userStats.wins}</span>
                        <span className="stat-label">Wins</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{userStats.losses}</span>
                        <span className="stat-label">Losses</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{userStats.currentStreak}</span>
                        <span className="stat-label">Current Streak</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{userStats.getWinPercentage().toFixed(1)}%</span>
                        <span className="stat-label">Win Rate</span>
                    </div>
                </div>
            </div>

            <div className="collection-container">
                <h3>Card Collection</h3>
                <div className="collection-card">
                    <span className="collection-count">{collectedCards}</span>
                    <span className="collection-label">Cards Collected</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;