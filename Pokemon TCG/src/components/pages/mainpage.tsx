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
}

const MainPage: React.FC<MainPageProps> = ({ isLoggedIn }) => {
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [showMissions, setShowMissions] = useState<boolean>(false);
    const [openedCards, setOpenedCards] = useState<PokemonCard[]>([]);
    const [showCards, setShowCards] = useState<boolean>(false);
    const { user, isLoading, error, refreshUserData } = useUser();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            console.log("User not logged in");
        }
    }, [isLoggedIn, isLoading]);

    const handleMissionsClick = () => {
        setShowMissions(true);
    };

    // Simulate pack opening with random cards
    const generateRandomCards = (): PokemonCard[] => {
        const cardPool = [
            () => new BulbasaurCard(),
            () => new IvysaurCard(),
            () => new VenusaurCard(),
            () => new VenusaurEXCard(),
        ];

        const cards: PokemonCard[] = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * cardPool.length);
            // Weight the rarity - make rare cards less common
            const rarity = Math.random();
            let selectedCard;
            
            if (rarity < 0.5) {
                selectedCard = new BulbasaurCard(); // Common
            } else if (rarity < 0.8) {
                selectedCard = new IvysaurCard(); // Uncommon
            } else if (rarity < 0.95) {
                selectedCard = new VenusaurCard(); // Rare
            } else {
                selectedCard = new VenusaurEXCard(); // Ultra Rare
            }
            
            cards.push(selectedCard);
        }
        return cards;
    };

    const handleOpenPack = async () => {
        if (!user) {
            console.error("No user data available");
            return;
        }

        setIsOpening(true);
        
        // Simulate pack opening animation
        setTimeout(async () => {
            const newCards = generateRandomCards();
            setOpenedCards(newCards);
            setIsOpening(false);
            setShowCards(true);
            
            console.log("Opening pack for user:", user.username);
            console.log("Cards obtained:", newCards.map(card => card.pokemonName));
            
            // Refresh user data after opening pack
            await refreshUserData();
        }, 2000);
    };

    const closeCardDisplay = () => {
        setShowCards(false);
        setOpenedCards([]);
    };

    if (isLoading) {
        return (
            <div className="main-container">
                <div className="loading-message">Loading...</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="main-container">
                <div className="login-message">Please log in to access the main page.</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-container">
                <div className="error-message">
                    {error}
                    <button onClick={refreshUserData} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="main-container">
                <div className="error-message">Failed to load user data.</div>
            </div>
        );
    }

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
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            ></div>
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