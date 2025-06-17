import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faClipboardList, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useUser } from '../feature/usercontext';
import Missions from '../feature/missions';
import { PokemonCard } from '../assets/PokemonCardsClass';
import { BulbasaurCard, IvysaurCard, VenusaurCard, VenusaurEXCard } from '../assets/BulbasaurEvoClass';
import "./mainPage.css";

interface MainPageProps {
  isLoggedIn: boolean;
  userData: {
    username: string;
    email: string;
    password: string;
  };
}

const MainPage: React.FC<MainPageProps> = ({ isLoggedIn }) => {
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [openedCards, setOpenedCards] = useState<any[]>([]);

    // Redirect to login if not authenticated
    useEffect(() => {
        const stored = localStorage.getItem("loggedInUser");
        if (stored) {
            setUser(User.fromJSON(JSON.parse(stored)));
        }
    }, []);

    const handleOpenPack = () => {
        if (!user || isOpening) return;

        setIsOpening(true);

        setTimeout(() => {
            // open booster pack
            let openedCards = user.openBoosterPack();
            setOpenedCards(openedCards);

            // saves updated uer to currently logged in user
            localStorage.setItem("loggedInUser", JSON.stringify(user.toJSON()));

            // update the actual users database object
            const usersRaw = localStorage.getItem("users");
            if (usersRaw) {
                const users = JSON.parse(usersRaw);

                // replace the user by finding the username as the key
                users[user.username] = user.toJSON();

                // save the updated users object
                localStorage.setItem("users", JSON.stringify(users));
            }

            // refresh the users state on the app
            setUser(User.fromJSON(JSON.parse(JSON.stringify(user.toJSON()))));

            setIsOpening(false);
        }, 2000);
    };

    return (
        <div className="main-container">
            <div className="user-welcome">
                <h1>Welcome back, {user.username}!</h1>
                <div className="user-stats">
                    <span>Currency: {user.currency}</span>
                </div>
            </div>

            <div className="pack-display-container">
                <h2>Base Set Pack</h2>
                <div className="pack-image">
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

            {isOpening && (
                <div className="pack-opening-animation">
                    <div className="cards-flipping">
                        {openedCards.map((card, index) => (
                            <div
                                key={index}
                                className={`card ${isOpening ? "flip" : ""}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
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

            {showCards && (
                <div className="card-reveal-modal">
                    <div className="card-reveal-container">
                        <div className="card-reveal-header">
                            <h2>Pack Contents</h2>
                            <button className="close-button" onClick={closeCardDisplay}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="revealed-cards">
                            {openedCards.map((card, index) => (
                                <div key={index} className={`pokemon-card rarity-${card.Rarity}`}>
                                    <div className="card-header">
                                        <div className="card-name">{card.pokemonName}</div>
                                        <div className="card-hp">HP {card.hp}</div>
                                    </div>
                                    <div className="card-image-container">
                                        <img 
                                            src="/placeholder-pokemon.png" 
                                            alt={card.pokemonName}
                                            className="card-image"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.style.backgroundColor = '#f0f0f0';
                                                    parent.innerHTML = `<div class="placeholder-text">${card.pokemonName}</div>`;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="card-info">
                                        <div className="card-type">{card.type.toUpperCase()}</div>
                                        {card.isEX && <div className="ex-marker">EX</div>}
                                    </div>
                                    <div className="card-description">
                                        {card.Description}
                                    </div>
                                    <div className="card-stats">
                                        <div className="stat">Stage: {card.evolutionStage}</div>
                                        {card.evolvesFrom && (
                                            <div className="stat">Evolves from: {card.evolvesFrom}</div>
                                        )}
                                        <div className="stat">Rarity: {card.Rarity}</div>
                                    </div>
                                    <div className="card-attacks">
                                        {card.Attacks.map((attack, attackIndex) => (
                                            <div key={attackIndex} className="attack">
                                                <strong>{attack.Name}</strong> - {attack.Damage} damage
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="continue-button" onClick={closeCardDisplay}>
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;