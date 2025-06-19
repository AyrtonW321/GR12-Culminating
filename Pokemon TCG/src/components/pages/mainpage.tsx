import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { User } from "../assets/UserClass.js";
import  Missions  from "../feature/missions.js";
import "./mainpage.css";

const MainPage = () => {
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [openedCards, setOpenedCards] = useState<any[]>([]);
    const [showAnimation, setShowAnimation] = useState<boolean>(false);
    const [showMissions, setShowMissions] = useState<boolean>(false);


    useEffect(() => {
        const stored = localStorage.getItem("loggedInUser");
        if (stored) {
            setUser(User.fromJSON(JSON.parse(stored)));
        }
    }, []);

    const handleOpenPack = () => {
        if (!user || isOpening) return;

        setIsOpening(true);

        // First open the pack to get the cards
        const newCards = user.openBoosterPack();
        setOpenedCards(newCards);

        // Show the animation
        setShowAnimation(true);

        // After animation completes, save the user data
        setTimeout(() => {
            // Save updated user to currently logged in user
            localStorage.setItem("loggedInUser", JSON.stringify(user.toJSON()));

            // Update the actual users database object
            const usersRaw = localStorage.getItem("users");
            if (usersRaw) {
                const users = JSON.parse(usersRaw);

                // Replace the user by finding the username as the key
                users[user.username] = user.toJSON();

                // Save the updated users object
                localStorage.setItem("users", JSON.stringify(users));
            }

            // Refresh the users state on the app
            setUser(User.fromJSON(JSON.parse(JSON.stringify(user.toJSON()))));

            setIsOpening(false);
            setShowAnimation(false);
        }, 3000); // Give enough time for the animation to complete
    };

    const handleMissionsClick = () => {
        setShowMissions(true);
    };

    return (
        <div className="main-container">
            <div className="pack-display-container">
                <h2>Base Set Pack</h2>
                <div className="pack-image">
                    {/* Empty div for your pack image - add background-image in CSS */}
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

            {/* Pack opening animation */}
            {showAnimation && openedCards.length > 0 && (
                <div className="pack-opening-animation">
                    <div className="cards-flipping">
                        {openedCards.map((card, index) => (
                            <div
                                key={index}
                                className={`card flip`}
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <div className="card-inner">
                                    <div
                                        className="card-front"
                                        style={{
                                            backgroundImage: `url("/cardBack.png")`
                                        }}
                                    ></div>
                                    <div
                                        className="card-back"
                                        style={{
                                            backgroundImage: `url(${card.pokemonPhoto})`,
                                        }}
                                        title={card.pokemonName || ""}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Display opened cards after animation */}
            {openedCards.length > 0 && !showAnimation && (
                <div className="opened-cards-display">
                    {openedCards.map((card, index) => (
                        <img
                            key={index}
                            src={card.pokemonPhoto}
                            alt={card.pokemonName || "Pokemon Card"}
                            title={card.pokemonName || ""}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainPage;