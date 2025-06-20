// import the necessary libraries and components
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faClipboardList, faHourglass } from "@fortawesome/free-solid-svg-icons";
import { User } from "../assets/UserClass.js";
import Missions from "../feature/missions.js";
import "./mainpage.css";

// mainpage interface
interface MainPageProps {
    onCoinsUpdate?: (newAmount: number) => void;
    onHourglassUpdate?: (newAmount: number) => void;
}

// Mainpage component
const MainPage = ({ onCoinsUpdate, onHourglassUpdate }: MainPageProps) => {
    // hooks for the states 
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [openedCards, setOpenedCards] = useState<any[]>([]);
    const [showAnimation, setShowAnimation] = useState<boolean>(false);
    const [showMissions, setShowMissions] = useState<boolean>(false);
    const [showInsufficientHourglasses, setShowInsufficientHourglasses] = useState<boolean>(false);

    // load user data from the local storage
    useEffect(() => {
        const stored = localStorage.getItem("loggedInUser");
        if (stored) {
            const loadedUser = User.fromJSON(JSON.parse(stored));
            // Sync hourglasses with localStorage
            loadedUser.syncHourglassesWithLocalStorage();
            setUser(loadedUser);

            // Notify parent component of current hourglass count
            if (onHourglassUpdate) {
                onHourglassUpdate(loadedUser.getCurrentHourglasses());
            }
        }
    }, [onHourglassUpdate]);

    // function to save user data
    const saveUserData = (updatedUser: User) => {
        // Save updated user to currently logged in user
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser.toJSON()));

        // Update the actual users database object
        const usersRaw = localStorage.getItem("users");
        if (usersRaw) {
            const users = JSON.parse(usersRaw);
            // Replace the user by finding the username as the key
            users[updatedUser.username] = updatedUser.toJSON();
            // Save the updated users object
            localStorage.setItem("users", JSON.stringify(users));
        }
    };

    // Update the handleOpenPack function
    const handleOpenPack = () => {
        if (!user || isOpening) return;

        // Get current hourglasses from user class (which syncs with localStorage)
        const currentHourglasses = user.getCurrentHourglasses();

        if (currentHourglasses < 12) {
            setShowInsufficientHourglasses(true);
            setTimeout(() => setShowInsufficientHourglasses(false), 3000);
            return;
        }

        setIsOpening(true);

        // Use the User class to open a pack (this handles hourglass deduction)
        const newCards = user.openPackUsingHourglass();
        if (!newCards) {
            setShowInsufficientHourglasses(true);
            setTimeout(() => setShowInsufficientHourglasses(false), 3000);
            setIsOpening(false);
            return;
        }

        // Notify parent component of updated hourglass count
        if (onHourglassUpdate) {
            onHourglassUpdate(user.getCurrentHourglasses());
        }

        // Update missions - NOW WITH USERNAME
        const username = user.username;
        const currentPacksOpened = parseInt(localStorage.getItem(`packsOpened_${username}`) || '0');
        localStorage.setItem(`packsOpened_${username}`, (currentPacksOpened + 1).toString());

        const currentCardsCollected = parseInt(localStorage.getItem(`cardsCollected_${username}`) || '0');
        localStorage.setItem(`cardsCollected_${username}`, (currentCardsCollected + newCards.length).toString());

        setOpenedCards(newCards);
        setShowAnimation(true);

        setTimeout(() => {
            saveUserData(user);
            setUser(User.fromJSON(JSON.parse(JSON.stringify(user.toJSON()))));
            setIsOpening(false);
            setShowAnimation(false);
        }, 3000);
    };


    // function to handle when the mission button is clicked
    const handleMissionsClick = () => {
        setShowMissions(true);
    };

    // update the coins
    const handleMissionCoinsUpdate = (newAmount: number) => {
        if (onCoinsUpdate) {
            onCoinsUpdate(newAmount);
        }
    };

    // Update the handleMissionHourglassUpdate function
    const handleMissionHourglassUpdate = (newAmount: number) => {
        if (user) {
            // Get current hourglasses from user class
            const currentHourglasses = user.getCurrentHourglasses();
            const difference = newAmount - currentHourglasses;

            if (difference !== 0) {
                if (difference > 0) {
                    user.addHourglass(difference);
                } else {
                    user.subtractHourglass(Math.abs(difference));
                }
                saveUserData(user);
                setUser(User.fromJSON(JSON.parse(JSON.stringify(user.toJSON()))));
            }
        }

        if (onHourglassUpdate) {
            onHourglassUpdate(newAmount);
        }
    };

        // Update the userHourglasses calculation
    const userHourglasses = user?.getCurrentHourglasses() || 0;

    // render 
    return (
        <div className="main-container">
            <div className="pack-display-container">
                <h2>Base Set Pack</h2>
                <div className="pack-image">
                </div>

                <div className="pack-cost">
                    <FontAwesomeIcon icon={faHourglass} style={{ color: '#f39c12' }} />
                    <span style={{ marginLeft: '8px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                        Cost: 12 hourglasses
                    </span>
                </div>

                <button
                    type="button"
                    className={`open-pack-button ${isOpening ? "opening" : ""} ${userHourglasses < 12 ? "disabled" : ""}`}
                    onClick={handleOpenPack}
                    disabled={isOpening || userHourglasses < 12}
                >
                    <FontAwesomeIcon icon={faGift} />
                    {isOpening ? "Opening..." : userHourglasses < 12 ? "Not Enough Hourglasses" : "Open Pack"}
                </button>

                {showInsufficientHourglasses && (
                    <div className="insufficient-hourglasses-message" style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        marginTop: '10px',
                        textAlign: 'center'
                    }}>
                        ❌ You need 12 hourglasses to open a pack! Visit the store to buy more.
                    </div>
                )}
            </div>

            <button className="missions-button" title="Missions" onClick={handleMissionsClick}>
                <FontAwesomeIcon icon={faClipboardList} />
                <span className="missions-label">Mission</span>
            </button>

            {showMissions && (
                <Missions
                    closeModal={() => setShowMissions(false)}
                    onCoinsUpdate={handleMissionCoinsUpdate}
                    onHourglassUpdate={handleMissionHourglassUpdate}
                />
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