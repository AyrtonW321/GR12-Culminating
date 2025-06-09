import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';
import './mainPage.css';

const MainPage = () => {
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const handleOpenPack = () => {
    setIsOpening(true);
    // Simulate pack opening animation
    setTimeout(() => {
      setIsOpening(false);
      // Here you would handle the actual pack opening logic
    }, 2000);
  };

  return (
    <div className="main-container">
      <div className="pack-display-container">
        <h2>Base Set Pack</h2>
        <div className="pack-image">
          {/* Empty div for your pack image - add background-image in CSS */}
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

      {/* Pack opening animation would go here */}
      {isOpening && (
        <div className="pack-opening-animation">
          <div className="cards-flipping">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card" style={{ animationDelay: `${index * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;