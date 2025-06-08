import { CharmanderCard, CharmeleonCard, CharizardCard, CharizardEXCard, } from "./CharmanderEvoClass.js";
import { BulbasaurCard, IvysaurCard, VenusaurCard, VenusaurEXCard, } from "./BulbasaurEvoClass.js";
import { SquirtleCard, WartortleCard, BlastoiseCard, BlastoiseEXCard, } from "./SquirtleEvoClass.js";
import { Deck } from "./DeckClass.js";
import { UserStats } from "./UserStatsClass.js";
const allCards = [
    new CharmanderCard(),
    new CharmeleonCard(),
    new CharizardCard(),
    new CharizardEXCard(),
    new BulbasaurCard(),
    new IvysaurCard(),
    new VenusaurCard(),
    new VenusaurEXCard(),
    new SquirtleCard(),
    new WartortleCard(),
    new BlastoiseCard(),
    new BlastoiseEXCard(),
];
export class User {
    constructor(username) {
        this._username = username;
        this._collection = new Map();
        this._gameStats = new UserStats(0, 0, 0);
    }
    get username() {
        return this._username;
    }
    get collection() {
        return this._collection;
    }
    get decks() {
        return this._decks;
    }
    get activeDeckId() {
        return this._activeDeckId;
    }
    set activeDeckId(id) {
        this._activeDeckId = id;
    }
    get victories() {
        return this._victories;
    }
    get bench() {
        return this._bench;
    }
    set bench(newBench) {
        this._bench = newBench;
    }
    get hand() {
        return this._hand;
    }
    set hand(newHand) {
        this._hand = newHand;
    }
    get discardPile() {
        return this._discardPile;
    }
    set discardPile(newDiscardPile) {
        this._discardPile = newDiscardPile;
    }
    get gameStats() {
        return this._gameStats;
    }
    get gameHistory() {
        return this._gameHistory;
    }
    get winRate() {
        return this._winRate;
    }
    openBoosterPack(cardsToOpen = 5) {
        const cardsByRarity = {};
        for (let rarity = 1; rarity <= 8; rarity++) {
            cardsByRarity[rarity] = allCards.filter((card) => card.Rarity === rarity);
        }
        // <order of card in pack, <rarity, drop rate in %>>
        const dropRates = {
            1: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
            2: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
            3: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
            4: {
                1: 0,
                2: 90,
                3: 5,
                4: 1.6,
                5: 2.572,
                6: 0.5,
                7: 0.222,
                8: 0.04,
            },
            5: {
                1: 0,
                2: 60,
                3: 20,
                4: 6.66,
                5: 10.288,
                6: 2,
                7: 0.888,
                8: 0.16,
            },
        };
        function adjustDropRates(slot) {
            const rates = dropRates[slot];
            const filteredRates = {};
            let totalRate = 0;
            const rarityTiers = Object.keys(rates);
            for (let i = 0; i < rarityTiers.length; i++) {
                const rarity = parseInt(rarityTiers[i]);
                if (cardsByRarity[rarity] &&
                    cardsByRarity[rarity].length > 0 &&
                    rates[rarity] > 0) {
                    filteredRates[rarity] = rates[rarity];
                    totalRate += rates[rarity];
                }
            }
            const filteredKeys = Object.keys(filteredRates);
            for (let i = 0; i < filteredKeys.length; i++) {
                const dropRate = parseInt(filteredKeys[i]);
                filteredRates[dropRate] = (filteredRates[dropRate] / totalRate) * 100;
            }
            return filteredRates;
        }
        function pickRarity(slot) {
            const rates = adjustDropRates(slot);
            const randomNum = Math.random() * 100;
            let totalDropRate = 0;
            const rarityTiers = Object.keys(rates);
            for (let i = 0; i < rarityTiers.length; i++) {
                const rarity = parseInt(rarityTiers[i]);
                totalDropRate += rates[rarity];
                if (randomNum <= totalDropRate) {
                    return rarity;
                }
            }
            return 1;
        }
        function getAvailableRarity(rarity) {
            for (let r = rarity; r >= 1; r--) {
                if (cardsByRarity[r] && cardsByRarity[r].length > 0) {
                    return r;
                }
            }
            return 1;
        }
        function pickCardFromRarity(rarity) {
            const list = cardsByRarity[rarity];
            if (!list || list.length === 0) {
                console.log("No cards available of rarity " + rarity);
            }
            const randomCardLocation = Math.floor(Math.random() * list.length);
            return list[randomCardLocation];
        }
        const godPackRoll = Math.random();
        if (godPackRoll <= 0.0005) {
            for (let rarity = 8; rarity >= 1; rarity--) {
                if (cardsByRarity[rarity] && cardsByRarity[rarity].length > 0) {
                    const godPackCards = [];
                    for (let i = 0; i < 5; i++) {
                        godPackCards.push(pickCardFromRarity(rarity));
                    }
                    return godPackCards;
                }
            }
        }
        const packCards = [];
        for (let slot = 1; slot <= cardsToOpen; slot++) {
            const slotRatesKey = slot <= 3 ? 1 : slot;
            let rarity = pickRarity(slotRatesKey);
            rarity = getAvailableRarity(rarity);
            const card = pickCardFromRarity(rarity);
            packCards.push(card);
        }
        this.addToCollection(packCards);
        return packCards;
    }
    addToCollection(cards) {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const currentCount = this._collection.get(card) || 0;
            this._collection.set(card, currentCount + 1);
        }
        return true;
    }
    searchCollection(filters) {
        const keys = [];
        const values = [];
        const currentIteration = this._collection.entries();
        let nextIteration = currentIteration.next();
        while (!nextIteration.done) {
            const [card, count] = nextIteration.value;
            keys.push(card);
            values.push(count);
            nextIteration = currentIteration.next();
        }
        const results = [];
        for (let i = 0; i < keys.length; i++) {
            const card = keys[i];
            const count = values[i];
            if (filters?.name &&
                !card.pokemonName
                    .toLowerCase()
                    .includes(filters.name.toLowerCase())) {
                continue;
            }
            if (filters?.type && card.type !== filters.type) {
                continue;
            }
            if (filters?.minRarity && card.Rarity < filters.minRarity) {
                continue;
            }
            if (filters?.maxRarity && card.Rarity > filters.maxRarity) {
                continue;
            }
            if (filters?.minHP && card.hp < filters.minHP) {
                continue;
            }
            if (filters?.maxHP && card.hp > filters.maxHP) {
                continue;
            }
            if (filters?.minCount && count < filters.minCount) {
                continue;
            }
            results.push({ card, count });
        }
        if (filters?.sortBy) {
            const descending = filters.sortOrder === "desc";
            for (let j = 0; j < results.length - 1; j++) {
                for (let k = 0; k < results.length - 1 - j; k++) {
                    const a = results[k];
                    const b = results[k + 1];
                    let shouldSwap = false;
                    switch (filters.sortBy) {
                        case "name":
                            // from z->a
                            if (descending) {
                                if (a.card.pokemonName.localeCompare(b.card.pokemonName) < 0) {
                                    shouldSwap = true;
                                }
                            }
                            else {
                                // from a->z
                                if (a.card.pokemonName.localeCompare(b.card.pokemonName) > 0) {
                                    shouldSwap = true;
                                }
                            }
                            break;
                        case "rarity":
                            if (descending) {
                                if (a.card.Rarity < b.card.Rarity) {
                                    shouldSwap = true;
                                }
                            }
                            else {
                                if (a.card.Rarity > b.card.Rarity) {
                                    shouldSwap = true;
                                }
                            }
                            break;
                        case "hp":
                            if (descending) {
                                if (a.card.hp < b.card.hp) {
                                    shouldSwap = true;
                                }
                            }
                            else {
                                if (a.card.hp > b.card.hp) {
                                    shouldSwap = true;
                                }
                            }
                            break;
                        case "count":
                            if (descending) {
                                if (a.count < b.count) {
                                    shouldSwap = true;
                                }
                            }
                            else {
                                if (a.count > b.count) {
                                    shouldSwap = true;
                                }
                            }
                            break;
                    }
                    if (shouldSwap) {
                        const temp = results[k];
                        results[k] = results[k + 1];
                        results[k + 1] = temp;
                    }
                }
            }
        }
        return results;
    }
    createDeck(name, cards, energyTypes = []) {
        if (!name.trim()) {
            console.log("Deck name cannot be empty");
            return null;
        }
        if (cards.length === 0) {
            console.log("Deck must contain at least 1 card");
            return null;
        }
        const newDeck = new Deck(name);
        for (let i = 0; i < cards.length; i++) {
            const { card, count } = cards[i];
            const available = this._collection.get(card) ?? 0;
            if (available < count) {
                console.log(`Not enough ${card.pokemonName} (Need ${count}, have ${available})`);
                return null;
            }
            if (!newDeck.addPokemonCard(card, count)) {
                console.log(`Failed to add ${count}x ${card.pokemonName}`);
                return null;
            }
        }
        for (let i = 0; i < energyTypes.length; i++) {
            if (!newDeck.addEnergyType(energyTypes[i])) {
                console.log(`Invalid energy type: ${energyTypes[i]}`);
                return null;
            }
        }
        if (!newDeck.validate()) {
            console.log("Deck failed validation - check card counts/energy requirements");
            return null;
        }
        this._decks.push(newDeck);
        console.log(`Created deck "${name}" with:
        - ${cards.reduce((sum, c) => sum + c.count, 0)} Pokemon cards
        - ${energyTypes.length} energy types`);
        return newDeck;
    }
    deleteDeck(deckName) {
        const index = this._decks.findIndex((deck) => deck.name === deckName);
        if (index === -1) {
            return false;
        }
        this._decks.splice(index, 1);
        return true;
    }
    drawCard() {
        // To be implemented
        return {};
    }
    playCard(card) {
        // To be implemented
        return false;
    }
    attachEnergy(pokemon, energy) {
        // To be implemented
        return false;
    }
    attack(attacker, attack, defender) {
        // To be implemented
        return false;
    }
    retreat(pokemon) {
        // To be implemented
        return false;
    }
    evolveCard(pokemon) {
        // To be implemented
        return false;
    }
    endGame(player1, player2) {
        if (player1._currentPoints === 3) {
            return { winner: player1._username, endGame: true };
        }
        if (player2._currentPoints === 3) {
            return { winner: player2._username, endGame: true };
        }
        return { endGame: false };
    }
    updateProfile(newUsername) {
        if (!newUsername || newUsername.trim().length === 0) {
            console.log("Username cannot be empty");
            return false;
        }
        this._username = newUsername;
        console.log(`Username changed to ${newUsername}`);
        return true;
    }
}
//# sourceMappingURL=UserClass.js.map