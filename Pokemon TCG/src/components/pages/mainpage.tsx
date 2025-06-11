import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import Missions from '../feature/missions';
import './mainPage.css';

const MainPage = () => {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [showMissions, setShowMissions] = useState<boolean>(false);

  const handleOpenPack = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
    }, 2000);
  };

  const handleMissionsClick = () => {
    setShowMissions(true);
  };

  return (
    <div className="main-container">
      <div className="pack-display-container">
        <h2>Base Set Pack</h2>
        <div className="pack-image">
        </div>

        <button
          type='button'
          className={`open-pack-button ${isOpening ? 'opening' : ''}`}
          onClick={handleOpenPack}
          disabled={isOpening}
        >
          <FontAwesomeIcon icon={faGift} />
          {isOpening ? 'Opening...' : 'Open Pack'}
        </button>
      </div>

      <button className="missions-button" title="Missions" onClick={handleMissionsClick}>
        <FontAwesomeIcon icon={faClipboardList} />
        <span className="missions-label">Mission</span>
      </button>

      {showMissions && (
        <Missions closeModal={() => setShowMissions(false)} />
      )}

      {/* Pack opening animation would go here
      {isOpening && (
        <div className="pack-opening-animation">
          <div className="cards-flipping">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card" style={{ animationDelay: `${index * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MainPage;