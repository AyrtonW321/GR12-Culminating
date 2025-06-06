import { BulbasaurCard, IvysaurCard, VenusaurCard, VenusaurEXCard, } from "./BulbasaurEvoLineClass";
import { CharmanderCard, CharmeleonCard, CharizardCard, CharizardEXCard, } from "./CharmanderEvoLineClass";
import { SquirtleCard, WartortleCard, BlastoiseCard, BlastoiseEXCard, } from "./SquirtleEvoLineClass";
import { FroakieCard, FrogadierCard, GreninjaCard, } from "./FroakieEvoLineClass";
export class BoosterPack {
    static cardDefinitions = [
        // Kanto Starters
        { name: "Bulbasaur", rarity: 1, cardClass: BulbasaurCard },
        { name: "Ivysaur", rarity: 2, cardClass: IvysaurCard },
        { name: "Venusaur", rarity: 3, cardClass: VenusaurCard },
        { name: "Venusaur EX", rarity: 4, cardClass: VenusaurEXCard },
        { name: "Charmander", rarity: 1, cardClass: CharmanderCard },
        { name: "Charmeleon", rarity: 2, cardClass: CharmeleonCard },
        { name: "Charizard", rarity: 3, cardClass: CharizardCard },
        { name: "Charizard EX", rarity: 4, cardClass: CharizardEXCard },
        { name: "Squirtle", rarity: 1, cardClass: SquirtleCard },
        { name: "Wartortle", rarity: 2, cardClass: WartortleCard },
        { name: "Blastoise", rarity: 3, cardClass: BlastoiseCard },
        { name: "Blastoise EX", rarity: 4, cardClass: BlastoiseEXCard },
        // Kalos Starter
        { name: "Froakie", rarity: 1, cardClass: FroakieCard },
        { name: "Frogadier", rarity: 2, cardClass: FrogadierCard },
        { name: "Greninja", rarity: 3, cardClass: GreninjaCard },
    ];
    static rarityTiers = [
        {
            name: "One-diamond",
            minRarity: 1,
            maxRarity: 1,
            rates: { standard: 100, higher: 0, highest: 0 },
        },
        {
            name: "Two-diamond",
            minRarity: 2,
            maxRarity: 2,
            rates: { standard: 0, higher: 90, highest: 60 },
        },
        {
            name: "Three-diamond",
            minRarity: 3,
            maxRarity: 3,
            rates: { standard: 0, higher: 5, highest: 20 },
        },
        {
            name: "Four-diamond",
            minRarity: 4,
            maxRarity: 4,
            rates: { standard: 0, higher: 1.6, highest: 6.66 },
        },
        {
            name: "One-star",
            minRarity: 5,
            maxRarity: 5,
            rates: { standard: 0, higher: 2.572, highest: 10.288 },
        },
        {
            name: "Two-star",
            minRarity: 6,
            maxRarity: 6,
            rates: { standard: 0, higher: 0.5, highest: 2 },
        },
        {
            name: "Three-star",
            minRarity: 7,
            maxRarity: 7,
            rates: { standard: 0, higher: 0.222, highest: 0.888 },
        },
        {
            name: "Crown",
            minRarity: 8,
            maxRarity: 8,
            rates: { standard: 0, higher: 0.04, highest: 0.16 },
        },
    ];
    static openPack(cardCount = 5) {
        const cards = [];
        const standardSlotCount = cardCount - 2; // 3 for 5 cards, 4 for 6 cards
        // Add standard slots
        for (let i = 0; i < standardSlotCount; i++) {
            cards.push(this.getCardForSlot("standard"));
        }
        // Add higher slot
        cards.push(this.getCardForSlot("higher"));
        // Add highest slot
        cards.push(this.getCardForSlot("highest"));
        return cards;
    }
    static getCardForSlot(slotType) {
        // Calculate total rates for the slot
        let totalRate = 0;
        for (let i = 0; i < this.rarityTiers.length; i++) {
            totalRate += this.rarityTiers[i].rates[slotType];
        }
        // Select a tier based on rates
        let random = Math.random() * totalRate;
        let selectedTier = this.rarityTiers[0]; // Default to One-diamond
        for (const tier of this.rarityTiers) {
            if (random < tier.rates[slotType]) {
                selectedTier = tier;
                break;
            }
            random -= tier.rates[slotType];
        }
        // Filter cards that match the selected tier
        const eligibleCards = this.cardDefinitions.filter((card) => card.rarity >= selectedTier.minRarity &&
            card.rarity <= selectedTier.maxRarity);
        // If no cards found, fallback to any card
        if (eligibleCards.length === 0) {
            const randomIndex = Math.floor(Math.random() * this.cardDefinitions.length);
            return new this.cardDefinitions[randomIndex].cardClass();
        }
        // Select and instantiate a random card from eligible ones
        const randomIndex = Math.floor(Math.random() * eligibleCards.length);
        return new eligibleCards[randomIndex].cardClass();
    }
    static getRarityName(rarity) {
        for (let i = 0; i < this.rarityTiers.length; i++) {
            const tier = this.rarityTiers[i];
            if (rarity >= tier.minRarity && rarity <= tier.maxRarity) {
                return tier.name;
            }
        }
        return "Unknown";
    }
}
//# sourceMappingURL=CardPackClass.js.map