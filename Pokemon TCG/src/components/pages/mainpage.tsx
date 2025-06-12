import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { User } from "../assets/UserClass";
import Missions from '../feature/missions';
import "./mainPage.css";

const MainPage = () => {
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("loggedInUser");
        if (stored) {
            setUser(User.fromJSON(JSON.parse(stored)));
        }
    }, []);

    console.log(user);
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
    const handleOpenPack = () => {
        setIsOpening(true);
        // Simulate pack opening animation
        setTimeout(() => {
            setIsOpening(false);
            console.log(user?.openBoosterPack());
        }, 2000);
        console.log(user);
    };

  return (
    <div className="main-container">
      <div className="pack-display-container">
        <h2>Base Set Pack</h2>
        <div className="pack-image">
        </div>
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
                <button
                    type="button"
                    className={`open-pack-button ${isOpening ? "opening" : ""}`}
                    onClick={handleOpenPack}
                    disabled={isOpening}
                >
                    <FontAwesomeIcon icon={faGift} />
                    {isOpening ? "Opening..." : "Open Pack"}
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
                            <div
                                key={index}
                                className="card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            ></div>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default MainPage;