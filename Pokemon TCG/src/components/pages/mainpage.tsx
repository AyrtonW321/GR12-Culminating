import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { User } from "../assets/UserClass";
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

    const handleOpenPack = () => {
        if (!user || isOpening) return;

        setIsOpening(true);

        setTimeout(() => {
            // Step 1: Open the pack and update user's collection
            user.openBoosterPack();

            // Step 2: Get all users from localStorage
            const allUsersRaw = localStorage.getItem("users");
            if (allUsersRaw) {
                const allUsers = JSON.parse(allUsersRaw);

                // Step 3: Manually find and replace the matching user
                for (let i = 0; i < allUsers.length; i++) {
                    if (allUsers[i]._email === user.email) {
                        allUsers[i] = user;
                        break;
                    }
                }

                // Step 4: Save updated list back
                localStorage.setItem("users", JSON.stringify(allUsers));
            }

            // Step 5: Update session user
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            setUser(User.fromJSON(JSON.parse(JSON.stringify(user))));
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
        </div>
    );
};

export default MainPage;
