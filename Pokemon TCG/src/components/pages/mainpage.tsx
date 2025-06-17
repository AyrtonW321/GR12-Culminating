import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { User } from "../assets/UserClass";
import "./mainPage.css";

const MainPage = () => {
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [openedCards, setOpenedCards] = useState<any[]>([]);

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

            {/* Pack opening animation would go here */}
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
        </div>
    );
};

export default MainPage;
