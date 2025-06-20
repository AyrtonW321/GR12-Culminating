// import neccessary libraries and components
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faTrophy, faCoins, faCheck, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { User } from "../assets/UserClass.js";
import './mission.css';

// interface for mission object
interface Mission {
  id: number;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  rewardAmount: number;
  completed: boolean;
}

// interface for props passed into missions component
interface MissionsProps {
  closeModal: () => void;
  onCoinsUpdate?: (newAmount: number) => void;
  onHourglassUpdate?: (newAmount: number) => void;
}

// Missions component
const Missions = ({ closeModal, onCoinsUpdate, onHourglassUpdate }: MissionsProps) => {
  // State variables for missions, coins, hourglasses, and user
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "First Steps",
      description: "Open your first card pack to begin your collection journey",
      progress: 0,
      maxProgress: 1,
      reward: "coins",
      rewardAmount: 100,
      completed: false
    },
    {
      id: 2,
      title: "Pack Enthusiast",
      description: "Open 5 card packs to expand your collection",
      progress: 0,
      maxProgress: 5,
      reward: "hourglasses",
      rewardAmount: 24,
      completed: false
    },
    {
      id: 3,
      title: "Collector",
      description: "Collect 10 different cards in your collection",
      progress: 0,
      maxProgress: 10,
      reward: "coins",
      rewardAmount: 300,
      completed: false
    },
    {
      id: 4,
      title: "Battle Ready",
      description: "Win your first battle against another player",
      progress: 0,
      maxProgress: 1,
      reward: "hourglasses",
      rewardAmount: 12,
      completed: false
    },
    {
      id: 5,
      title: "Shopping Spree",
      description: "Make your first purchase in the store",
      progress: 0,
      maxProgress: 1,
      reward: "coins",
      rewardAmount: 150,
      completed: false
    },
    {
      id: 6,
      title: "Profile Complete",
      description: "Update your profile with a custom picture and display name",
      progress: 0,
      maxProgress: 1,
      reward: "hourglasses",
      rewardAmount: 6,
      completed: false
    }
  ]);

  // hook state variables for coins, etc
  const [coins, setCoins] = useState<number>(1000);
  const [hourglasses, setHourglasses] = useState<number>(12);
  const [user, setUser] = useState<User | null>(null);

  // Load user and mission progress, coins, and hourglasses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      const loadedUser = User.fromJSON(JSON.parse(stored));
      loadedUser.syncHourglassesWithLocalStorage();
      setUser(loadedUser);
      setHourglasses(loadedUser.getCurrentHourglasses());

      const username = loadedUser.username;

      // Load missions with username
      const savedMissions = localStorage.getItem(`userMissions_${username}`);
      if (savedMissions) {
        setMissions(JSON.parse(savedMissions));
      }

      // Load coins with username
      const savedCoins = localStorage.getItem(`userCoins_${username}`);
      if (savedCoins) {
        setCoins(parseInt(savedCoins));
      } else {
        // Initialize with default value
        localStorage.setItem(`userCoins_${username}`, '1000');
        setCoins(1000);
      }
    } else {
      // Fallback behavior if no user data
      const savedMissions = localStorage.getItem('userMissions');
      if (savedMissions) {
        setMissions(JSON.parse(savedMissions));
      }
      
      const savedCoins = localStorage.getItem('userCoins');
      if (savedCoins) {
        setCoins(parseInt(savedCoins));
      }
      
      const savedHourglasses = localStorage.getItem('userHourglasses');
      if (savedHourglasses) {
        setHourglasses(parseInt(savedHourglasses));
      }
    }
  }, []);

  // Update mission progress based on user actions
  useEffect(() => {
    if (!user) return;

    const updateMissionProgress = () => {
      const username = user.username;
      
      const packsOpened = parseInt(localStorage.getItem(`packsOpened_${username}`) || '0');
      const cardsCollected = parseInt(localStorage.getItem(`cardsCollected_${username}`) || '0');
      const battlesWon = parseInt(localStorage.getItem(`battlesWon_${username}`) || '0');
      const storeVisited = localStorage.getItem(`storeVisited_${username}`) === 'true';
      const profileUpdated = localStorage.getItem(`profileUpdated_${username}`) === 'true';

      setMissions(prevMissions => {
        const updatedMissions = prevMissions.map(mission => {
          if (mission.completed) return mission;

          switch (mission.id) {
            case 1: // First Steps - Open first pack
              return { ...mission, progress: Math.min(packsOpened, mission.maxProgress) };
            case 2: // Pack Enthusiast - Open 5 packs
              return { ...mission, progress: Math.min(packsOpened, mission.maxProgress) };
            case 3: // Collector - Collect 10 cards
              return { ...mission, progress: Math.min(cardsCollected, mission.maxProgress) };
            case 4: // Battle Ready - Win first battle
              return { ...mission, progress: Math.min(battlesWon, mission.maxProgress) };
            case 5: // Shopping Spree - Make first purchase
              return { ...mission, progress: storeVisited ? 1 : 0 };
            case 6: // Profile Complete - Update profile
              return { ...mission, progress: profileUpdated ? 1 : 0 };
            default:
              return mission;
          }
        });

        // Save updated missions with username
        localStorage.setItem(`userMissions_${username}`, JSON.stringify(updatedMissions));
        return updatedMissions;
      });
    };

    updateMissionProgress();
  }, [user]);

  // Save user data to localStorage and update User class
  const saveUserData = (newCoins: number, newHourglasses: number) => {
    if (user) {
      // Store coins with username
      localStorage.setItem(`userCoins_${user.username}`, newCoins.toString());

      // Update user class hourglasses (this also updates localStorage with username)
      const currentHourglasses = user.getCurrentHourglasses();
      const difference = newHourglasses - currentHourglasses;

      if (difference > 0) {
        user.addHourglass(difference);
      } else if (difference < 0) {
        user.subtractHourglass(Math.abs(difference));
      }

      // Save updated user to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user.toJSON()));

      // Update the actual users database object
      const usersRaw = localStorage.getItem("users");
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        users[user.username] = user.toJSON();
        localStorage.setItem("users", JSON.stringify(users));
      }
    } else {
      // Fallback if no user class
      localStorage.setItem('userCoins', newCoins.toString());
      localStorage.setItem('userHourglasses', newHourglasses.toString());
    }
  };

  // handle mission click to complete and claim rewards
  const handleMissionClick = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    
    if (mission && !mission.completed && mission.progress >= mission.maxProgress) {
      // Complete the mission and give reward
      const updatedMissions = missions.map(m => {
        if (m.id === missionId) {
          return { ...m, completed: true };
        }
        return m;
      });

      // Award reward based on type
      if (mission.reward === 'coins') {
        const newCoins = coins + mission.rewardAmount;
        setCoins(newCoins);
        saveUserData(newCoins, hourglasses);
        
        // Notify parent component about coin update
        if (onCoinsUpdate) {
          onCoinsUpdate(newCoins);
        }
      } else if (mission.reward === 'hourglasses') {
        const newHourglasses = hourglasses + mission.rewardAmount;
        setHourglasses(newHourglasses);
        saveUserData(coins, newHourglasses);
        
        // Notify parent component about hourglass update
        if (onHourglassUpdate) {
          onHourglassUpdate(newHourglasses);
        }
      }

      // Save updated missions with username
      if (user) {
        localStorage.setItem(`userMissions_${user.username}`, JSON.stringify(updatedMissions));
      } else {
        localStorage.setItem('userMissions', JSON.stringify(updatedMissions));
      }
      setMissions(updatedMissions);
    }
  };

  // function to calc the prograss
  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  // function to get the icon for the missions
  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'coins':
        return faCoins;
      case 'hourglasses':
        return faHourglass;
      case 'pack':
        return faGift;
      default:
        return faTrophy;
    }
  };

  // function to get teh text for the missions
  const getRewardText = (rewardType: string, amount: number) => {
    switch (rewardType) {
      case 'coins':
        return `${amount} Coins`;
      case 'hourglasses':
        return `${amount} Hourglasses`;
      case 'pack':
        return `${amount} Free Pack`;
      default:
        return `${amount} Points`;
    }
  };

  // function to check if the mission is done
  const canClaimReward = (mission: Mission) => {
    return !mission.completed && mission.progress >= mission.maxProgress;
  };

  // render
  return (
    <div className="missionOverlay" onClick={closeModal}>
      <div className="missionContent" onClick={(e) => e.stopPropagation()}>        
        <div className="missionHeader">
          <h1>Daily Missions</h1>
          <p>Complete missions to earn rewards and progress in your journey!</p>
          <div className="currencyDisplay" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <div className="coinDisplay">
              <FontAwesomeIcon icon={faCoins} />
              <span>Coins: {coins.toLocaleString()}</span>
            </div>
            <div className="hourglassDisplay">
              <FontAwesomeIcon icon={faHourglass} style={{ color: '#f39c12' }} />
              <span>Hourglasses: {hourglasses}</span>
            </div>
          </div>
        </div>

        <div className="missionsList">
          {missions.length > 0 ? (
            missions.map((mission) => (
              <div
                key={mission.id}
                className={`missionCard ${mission.completed ? 'completed' : ''} ${canClaimReward(mission) ? 'claimable' : ''}`}
                onClick={() => handleMissionClick(mission.id)}
                style={{ cursor: canClaimReward(mission) ? 'pointer' : 'default' }}
              >
                <div className="missionTitle">
                  {mission.completed ? (
                    <FontAwesomeIcon icon={faCheck} style={{ color: '#28a745' }} />
                  ) : (
                    <FontAwesomeIcon icon={faTrophy} style={{ color: '#f34013' }} />
                  )}
                  {mission.title}
                  {canClaimReward(mission) && (
                    <span className="claimButton">Click to Claim!</span>
                  )}
                </div>
                
                <div className="missionDescription">
                  {mission.description}
                </div>

                <div className="missionProgress">
                  <span className="progressText">
                    Progress: {mission.progress}/{mission.maxProgress}
                  </span>
                </div>

                <div className="progressBar">
                  <div
                    className={`progressFill ${mission.completed ? 'completed' : ''}`}
                    style={{ width: `${getProgressPercentage(mission.progress, mission.maxProgress)}%` }}
                  ></div>
                </div>

                <div className={`missionReward ${mission.completed ? 'completed' : ''}`}>
                  <FontAwesomeIcon 
                    icon={getRewardIcon(mission.reward)} 
                    style={{ 
                      color: mission.reward === 'hourglasses' ? '#f39c12' : undefined 
                    }} 
                  />
                  <span>
                    Reward: {getRewardText(mission.reward, mission.rewardAmount)}
                    {mission.completed && ' - Claimed!'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="emptyMissions">
              <h3>No missions available</h3>
              <p>Check back later for new challenges!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Missions;