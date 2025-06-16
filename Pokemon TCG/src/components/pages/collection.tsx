import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { User } from "../assets/UserClass";
import './collection.css';

const Collection = () => {
    const [user, setUser] = useState<User | null>(null);
    const [cards, setCards] = useState<[any, number][]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("loggedInUser");
        if (stored) {
            const parsed = User.fromJSON(JSON.parse(stored));
            setUser(parsed);

            const collectionEntries = Array.from(parsed.collection.entries());
            setCards(collectionEntries);
        }
    }, []);

    console.log("CURR USER:", user);

    return (
        <>
            <div className="collection-container">
                {cards.map(([card, count], index) => (
                    <div className="card-slot" key={index}>
                        <img src={card.pokemonPhoto} alt={card.name || "Pokemon Card"} className="card-image" />
                        <div className="card-count">{count}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Collection;
