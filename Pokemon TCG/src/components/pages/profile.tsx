import { useEffect, useState } from 'react';
import { UserStats } from '../assets/UserStatsClass';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../assets/firebaseConfig';
import './profile.css';

interface ProfileProps {
  userData: {
    username: string;
    email: string;
    password: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const [displayName, setDisplayName] = useState<string>('PokemonTrainer');
  const [userStats, setUserStats] = useState<UserStats>(new UserStats());
  const [collectedCards, setCollectedCards] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string>('/default-pfp.png');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userData) return;

      const storedDisplayName = localStorage.getItem(`displayName_${userData.username}`) || userData.username;
      const storedProfileImage = localStorage.getItem(`profileImage_${userData.username}`) || '/default-pfp.png';

      setDisplayName(storedDisplayName);
      setProfileImage(storedProfileImage);

      try {
        const userRef = doc(db, 'users', userData.username);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) return;

        const data = userDoc.data();
        setEmail(data.email || '');

        if (data.stats) {
          const { wins, losses, currentStreak } = data.stats;
          setUserStats(new UserStats(wins || 0, losses || 0, currentStreak || 0));
        }

        if (data.cards && Array.isArray(data.cards)) {
          const total = data.cards.reduce((sum: number, entry: any) => sum + (entry.count || 0), 0);
          setCollectedCards(total);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadUserProfile();
  }, [userData]);

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
