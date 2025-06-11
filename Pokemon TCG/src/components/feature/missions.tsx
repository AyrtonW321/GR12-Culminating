import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faTrophy, faCoins, faCheck } from '@fortawesome/free-solid-svg-icons';
import './mission.css';

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

interface MissionsProps {
  closeModal: () => void;
}

const Missions = ({ closeModal }: MissionsProps) => {
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
      reward: "coins",
      rewardAmount: 250,
      completed: false
    },
    {
      id: 3,
      title: "Collector",
      description: "Collect 10 different cards in your collection",
      progress: 0,
      maxProgress: 10,
      reward: "pack",
      rewardAmount: 1,
      completed: false
    },
    {
      id: 4,
      title: "Battle Ready",
      description: "Win your first battle against another player",
      progress: 0,
      maxProgress: 1,
      reward: "coins",
      rewardAmount: 200,
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
      reward: "coins",
      rewardAmount: 100,
      completed: false
    }
  ]);

  // Load mission progress from localStorage
  useEffect(() => {
    const savedMissions = localStorage.getItem('userMissions');
    if (savedMissions) {
      setMissions(JSON.parse(savedMissions));
    }
  }, []);

  // Save mission progress to localStorage
  const saveMissions = (updatedMissions: Mission[]) => {
    localStorage.setItem('userMissions', JSON.stringify(updatedMissions));
    setMissions(updatedMissions);
  };

  const handleMissionClick = (missionId: number) => {
    const updatedMissions = missions.map(mission => {
      if (mission.id === missionId && !mission.completed && mission.progress >= mission.maxProgress) {
        // Complete the mission and give reward
        return { ...mission, completed: true };
      }
      return mission;
    });
    saveMissions(updatedMissions);
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'coins':
        return faCoins;
      case 'pack':
        return faGift;
      default:
        return faTrophy;
    }
  };

  const getRewardText = (rewardType: string, amount: number) => {
    switch (rewardType) {
      case 'coins':
        return `${amount} Coins`;
      case 'pack':
        return `${amount} Free Pack`;
      default:
        return `${amount} Points`;
    }
  };

  return (
    <div className="missionOverlay" onClick={closeModal}>
      <div className="missionContent" onClick={(e) => e.stopPropagation()}>        
        <div className="missionHeader">
          <h1>Daily Missions</h1>
          <p>Complete missions to earn rewards and progress in your journey!</p>
        </div>

        <div className="missionsList">
          {missions.length > 0 ? (
            missions.map((mission) => (
              <div
                key={mission.id}
                className={`missionCard ${mission.completed ? 'completed' : ''}`}
                onClick={() => handleMissionClick(mission.id)}
              >
                <div className="missionTitle">
                  {mission.completed ? (
                    <FontAwesomeIcon icon={faCheck} style={{ color: '#28a745' }} />
                  ) : (
                    <FontAwesomeIcon icon={faTrophy} style={{ color: '#f34013' }} />
                  )}
                  {mission.title}
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
                  <FontAwesomeIcon icon={getRewardIcon(mission.reward)} />
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