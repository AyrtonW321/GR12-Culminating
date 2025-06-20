// import the necessary libraries and components
import { useEffect, useState } from 'react';
import { UserStats } from '../assets/UserStatsClass.js';
import './profile.css';

// interface for profil
interface ProfileProps {
  userData: {
    username: string;
    email: string;
    password: string;
  };
}

// Profile component
const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const [displayName, setDisplayName] = useState<string>('PokemonTrainer');
  const [userStats, setUserStats] = useState<UserStats>(new UserStats());
  const [collectedCards, setCollectedCards] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string>('/default-pfp.png');
  const [email, setEmail] = useState<string>(userData.email);

  // load the user data from local storage
  useEffect(() => {
    if (!userData) return;

    const storedDisplayName = localStorage.getItem(`displayName_${userData.username}`) || userData.username;
    const storedProfileImage = localStorage.getItem(`profileImage_${userData.username}`) || '/default-pfp.png';
    const storedStats = localStorage.getItem(`userStats_${userData.username}`);
    const storedCards = localStorage.getItem(`collectedCards_${userData.username}`);

    setDisplayName(storedDisplayName);
    setProfileImage(storedProfileImage);
    setEmail(userData.email);

    if (storedStats) {
      try {
        const parsedStats = JSON.parse(storedStats);
        setUserStats(new UserStats(parsedStats.wins || 0, parsedStats.losses || 0, parsedStats.currentStreak || 0));
      } catch (error) {
        console.error('Failed to parse user stats:', error);
      }
    }

    if (storedCards) {
      const cardCount = parseInt(storedCards);
      if (!isNaN(cardCount)) {
        setCollectedCards(cardCount);
      }
    }
  }, [userData]);

  // render the profile
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
