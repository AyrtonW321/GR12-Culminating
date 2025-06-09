import { useState, useEffect } from 'react';
import { UserStats } from '../assets/UserStatsClass';
import './profile.css';

const Profile = () => {
    const [username, setUsername] = useState<string>('PokemonTrainer');
    const [userStats, setUserStats] = useState<UserStats>(new UserStats());
    const [collectedCards, setCollectedCards] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>('/default-pfp.png');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Load user data (in a real app, this would come from an API)
    useEffect(() => {
        // Simulate loading user data
        const loadedStats = new UserStats(1, 1, 1);
        setUserStats(loadedStats);
        setCollectedCards(0);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProfileImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const saveUsername = () => {
        setIsEditing(false);
        // In a real app, you would save to your backend here
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
                    <label className="change-pfp-button">
                        Change
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <div className="username-section">
                    {isEditing ? (
                        <div className="username-edit">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="username-input"
                            />
                            <button onClick={saveUsername} className="save-button">
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="username-display">
                            <h2>{username}</h2>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="edit-button"
                            >
                                Edit
                            </button>
                        </div>
                    )}
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