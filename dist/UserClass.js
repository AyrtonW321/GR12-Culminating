import { CharmanderCard, CharmeleonCard, CharizardCard, CharizardEXCard, } from "./CharmanderEvoClass.js";
import { BulbasaurCard, IvysaurCard, VenusaurCard, VenusaurEXCard, } from "./BulbasaurEvoClass.js";
import { SquirtleCard, WartortleCard, BlastoiseCard, BlastoiseEXCard, } from "./SquirtleEvoClass.js";
export class User {
    constructor(username) {
        this._username = username;
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
        // Rarities numbers from 1 to 8
        const rarityNames = [
            null, // index 0 unused
            "oneDiamond",
            "twoDiamond",
            "threeDiamond",
            "fourDiamond",
            "oneStar",
            "twoStar",
            "threeStar",
            "crown",
        ];
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
        // Group cards by rarity (rarity assumed number 1-8)
        const cardsByRarity = {};
        for (let r = 1; r <= 8; r++) {
            cardsByRarity[r] = allCards.filter((c) => c.Rarity === r);
        }
        // Base drop rates by slot and rarity in percent
        const dropRatesBySlot = {
            1: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }, // slots 1-3 share same rates
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
        // Adjust drop rates for each slot to remove rarities with no cards and recalc probabilities
        function adjustDropRates(slot) {
            const rates = dropRatesBySlot[slot];
            // Filter rarities that have cards
            const filteredRates = {};
            let totalRate = 0;
            // gets the rarity tiers
            const rarityTiers = Object.keys(rates);
            for (let i = 0; i < rarityTiers.length; i++) {
                const r = parseInt(rarityTiers[i]);
                if (cardsByRarity[r] &&
                    cardsByRarity[r].length > 0 &&
                    rates[r] > 0) {
                    filteredRates[r] = rates[r];
                    totalRate += rates[r];
                }
            }
            const filteredKeys = Object.keys(filteredRates);
            for (let i = 0; i < filteredKeys.length; i++) {
                const r = parseInt(filteredKeys[i]);
                filteredRates[r] = (filteredRates[r] / totalRate) * 100;
            }
            return filteredRates;
        }
        // Given adjusted drop rates, pick rarity based on random number
        function pickRarity(slot) {
            const rates = adjustDropRates(slot);
            const rand = Math.random() * 100;
            let cumulative = 0;
            const rarityTiers = Object.keys(rates);
            for (let i = 0; i < rarityTiers.length; i++) {
                const rarity = parseInt(rarityTiers[i]);
                cumulative += rates[rarity];
                if (rand <= cumulative) {
                    return rarity;
                }
            }
            // fallback to 1 rarity if fails
            return 1;
        }
        // If a rarity is picked but has no cards, downgrade to next lower rarity that has cards
        function getAvailableRarity(rarity) {
            for (let r = rarity; r >= 1; r--) {
                if (cardsByRarity[r] && cardsByRarity[r].length > 0) {
                    return r;
                }
            }
            // If none found, fallback to lowest rarity
            return 1;
        }
        // Pick a random card from a rarity
        function pickCardFromRarity(rarity) {
            const list = cardsByRarity[rarity];
            if (!list || list.length === 0) {
                throw new Error("No cards available of rarity " + rarity);
            }
            const idx = Math.floor(Math.random() * list.length);
            return list[idx];
        }
        // Check for God Pack chance 0.05% (1/2000)
        const godPackRoll = Math.random();
        if (godPackRoll <= 0.0005) {
            // God pack: 5 cards, all highest rarity available
            for (let rarity = 8; rarity >= 1; rarity--) {
                if (cardsByRarity[rarity] && cardsByRarity[rarity].length > 0) {
                    // Return 5 random cards from this rarity
                    const godPackCards = [];
                    for (let i = 0; i < 5; i++) {
                        godPackCards.push(pickCardFromRarity(rarity));
                    }
                    return godPackCards;
                }
            }
        }
        // Normal pack opening
        const packCards = [];
        for (let slot = 1; slot <= cardsToOpen; slot++) {
            // Slots 1-3 use slot 1 drop rates
            const slotRatesKey = slot <= 3 ? 1 : slot;
            let rarity = pickRarity(slotRatesKey);
            // If no cards of picked rarity, downgrade rarity
            rarity = getAvailableRarity(rarity);
            const card = pickCardFromRarity(rarity);
            packCards.push(card);
        }
        return packCards;
    }
    addToCollection(cards) {
        // To be implemented
        return false;
    }
    removeFromCollection(card, quantity) {
        // To be implemented
        return [];
    }
    searchCollection(filter) {
        // To be implemented
        return [];
    }
    createDeck(deckCards) {
        // To be implemented
        return {};
    }
    deleteDeck(deckId) {
        // To be implemented
        return false;
    }
    addToDeck(deckId, card) {
        // To be implemented
        return false;
    }
    removeFromDeck(deckId, cardId) {
        // To be implemented
        return false;
    }
    validateDeck(deckId) {
        // To be implemented
        return false;
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
    endGame() {
        // To be implemented
    }
    updateProfile(newUsername) {
        // To be implemented
        return false;
    }
}
//# sourceMappingURL=UserClass.js.map