import { useEffect, useState } from "react";
import { User } from "../assets/UserClass";
import './collection.css';

const Collection = () => {
    const [user, setUser] = useState<User | null>(null);
    const [cards, setCards] = useState<[any, number][]>([]);

    // Filter states
    const [nameFilter, setNameFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [minRarity, setMinRarity] = useState<number | "">("");
    const [maxRarity, setMaxRarity] = useState<number | "">("");
    const [minHP, setMinHP] = useState<number | "">("");
    const [maxHP, setMaxHP] = useState<number | "">("");
    const [minCount, setMinCount] = useState<number | "">("");
    const [sortBy, setSortBy] = useState<"name" | "rarity" | "hp" | "count" | "">("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Load user & initial cards
    useEffect(() => {
        const stored = localStorage.getItem("loggedInUser");
        if (stored) {
            const parsedUser = User.fromJSON(JSON.parse(stored));
            setUser(parsedUser);

            // Show all collection cards initially
            const initialCards = Array.from(parsedUser.collection.entries());
            setCards(initialCards);
        }
    }, []);

    // Update cards when filters change
    useEffect(() => {
        if (!user) return;

        const filters = {
            name: nameFilter || undefined,
            type: typeFilter || undefined,
            minRarity: minRarity === "" ? undefined : Number(minRarity),
            maxRarity: maxRarity === "" ? undefined : Number(maxRarity),
            minHP: minHP === "" ? undefined : Number(minHP),
            maxHP: maxHP === "" ? undefined : Number(maxHP),
            minCount: minCount === "" ? undefined : Number(minCount),
            sortBy: sortBy || undefined,
            sortOrder: sortOrder || undefined,
        };

        const results = user.searchCollection(filters);
        setCards(results.map(({ card, count }) => [card, count]));
    }, [nameFilter, typeFilter, minRarity, maxRarity, minHP, maxHP, minCount, sortBy, sortOrder, user]);

    return (
        <>
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Name"
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Type"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Min Rarity"
                    min={0}
                    value={minRarity}
                    onChange={e => setMinRarity(e.target.value === "" ? "" : Number(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Max Rarity"
                    min={0}
                    value={maxRarity}
                    onChange={e => setMaxRarity(e.target.value === "" ? "" : Number(e.target.value))}
                />

                <input
                    type="number"
                    placeholder="Min HP"
                    min={0}
                    value={minHP}
                    onChange={e => setMinHP(e.target.value === "" ? "" : Number(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Max HP"
                    min={0}
                    value={maxHP}
                    onChange={e => setMaxHP(e.target.value === "" ? "" : Number(e.target.value))}
                />

                <input
                    type="number"
                    placeholder="Min Count"
                    min={0}
                    value={minCount}
                    onChange={e => setMinCount(e.target.value === "" ? "" : Number(e.target.value))}
                />

                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                >
                    <option value="">Sort By</option>
                    <option value="name">Name</option>
                    <option value="rarity">Rarity</option>
                    <option value="hp">HP</option>
                    <option value="count">Count</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value as "asc" | "desc")}
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>

            {/* Cards */}
            <div className="collection-container">
                {cards.map(([card, count], index) => (
                    <div className="card-slot" key={index}>
                        <img
                            src={card.pokemonPhoto}
                            alt={card.pokemonName || "Pokemon Card"}
                            className="card-image"
                        />
                        <div className="card-count">{count}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Collection;
