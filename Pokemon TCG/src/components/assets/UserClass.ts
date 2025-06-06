import { PokemonCard } from "./PokemonCardsClass.js";
import {
    CharmanderCard,
    CharmeleonCard,
    CharizardCard,
    CharizardEXCard,
} from "./CharmanderEvoClass.js";
import {
    BulbasaurCard,
    IvysaurCard,
    VenusaurCard,
    VenusaurEXCard,
} from "./BulbasaurEvoClass.js";
import {
    SquirtleCard,
    WartortleCard,
    BlastoiseCard,
    BlastoiseEXCard,
} from "./SquirtleEvoClass.js";
import { Deck } from "./DeckClass.js";
import { GameStats } from "./GameStatsClass.js";
import { GameRecord } from "./GameRecordClass.js";
import { Attack } from "./AttacksClass.js";

type EnergyType = string;
type searchFilter = (card: PokemonCard) => boolean;

export class User {
    private _username: string;
    private _collection: Map<PokemonCard, number>;
    private _decks: Deck[];
    private _activeDeckId: string;
    private _victories: number;
    private _bench: PokemonCard[];
    private _hand: PokemonCard[];
    private _discardPile: PokemonCard[];
    private _gameStats: GameStats;
    private _winRate: number;
    private _gameHistory: GameRecord[];

    constructor(username: string) {
        this._username = username;
    }

    get username(): string {
        return this._username;
    }

    get collection(): Map<PokemonCard, number> {
        return this._collection;
    }

    get decks(): Deck[] {
        return this._decks;
    }

    get activeDeckId(): string {
        return this._activeDeckId;
    }

    set activeDeckId(id: string) {
        this._activeDeckId = id;
    }

    get victories(): number {
        return this._victories;
    }

    get bench(): PokemonCard[] {
        return this._bench;
    }

    set bench(newBench: PokemonCard[]) {
        this._bench = newBench;
    }

    get hand(): PokemonCard[] {
        return this._hand;
    }

    set hand(newHand: PokemonCard[]) {
        this._hand = newHand;
    }

    get discardPile(): PokemonCard[] {
        return this._discardPile;
    }

    set discardPile(newDiscardPile: PokemonCard[]) {
        this._discardPile = newDiscardPile;
    }

    get gameStats(): GameStats {
        return this._gameStats;
    }

    get gameHistory(): GameRecord[] {
        return this._gameHistory;
    }

    get winRate(): number {
        return this._winRate;
    }

    public openBoosterPack(cardsToOpen: number = 5): PokemonCard[] {
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

        const allCards: PokemonCard[] = [
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
        const cardsByRarity: Record<number, PokemonCard[]> = {};
        for (let r = 1; r <= 8; r++) {
            cardsByRarity[r] = allCards.filter((c) => c.Rarity === r);
        }

        // Base drop rates by slot and rarity in percent
        const dropRatesBySlot: Record<number, Record<number, number>> = {
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
        function adjustDropRates(slot: number) {
            const rates = dropRatesBySlot[slot];
            // Filter rarities that have cards
            const filteredRates: Record<number, number> = {};
            let totalRate = 0;

            // gets the rarity tiers
            const rarityTiers = Object.keys(rates);

            for (let i = 0; i < rarityTiers.length; i++) {
                const r = parseInt(rarityTiers[i]);
                if (
                    cardsByRarity[r] &&
                    cardsByRarity[r].length > 0 &&
                    rates[r] > 0
                ) {
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
        function pickRarity(slot: number): number {
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
        function getAvailableRarity(rarity: number): number {
            for (let r = rarity; r >= 1; r--) {
                if (cardsByRarity[r] && cardsByRarity[r].length > 0) {
                    return r;
                }
            }
            // If none found, fallback to lowest rarity
            return 1;
        }

        // Pick a random card from a rarity
        function pickCardFromRarity(rarity: number): PokemonCard {
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
                    const godPackCards: PokemonCard[] = [];
                    for (let i = 0; i < 5; i++) {
                        godPackCards.push(pickCardFromRarity(rarity));
                    }
                    return godPackCards;
                }
            }
        }

        // Normal pack opening
        const packCards: PokemonCard[] = [];

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

    public addToCollection(cards: PokemonCard[]): boolean {
        // To be implemented
        return false;
    }

    public removeFromCollection(
        card: PokemonCard,
        quantity: number
    ): PokemonCard[] {
        // To be implemented
        return [];
    }

    public searchCollection(filter: searchFilter): PokemonCard[] {
        // To be implemented
        return [];
    }

    public createDeck(deckCards: PokemonCard): Deck {
        // To be implemented
        return {} as Deck;
    }

    public deleteDeck(deckId: string): boolean {
        // To be implemented
        return false;
    }

    public addToDeck(deckId: string, card: PokemonCard): boolean {
        // To be implemented
        return false;
    }

    public removeFromDeck(deckId: string, cardId: string): boolean {
        // To be implemented
        return false;
    }

    public validateDeck(deckId: string): boolean {
        // To be implemented
        return false;
    }

    public drawCard(): PokemonCard {
        // To be implemented
        return {} as PokemonCard;
    }

    public playCard(card: PokemonCard): boolean {
        // To be implemented
        return false;
    }

    public attachEnergy(pokemon: PokemonCard, energy: EnergyType): boolean {
        // To be implemented
        return false;
    }

    public attack(
        attacker: PokemonCard,
        attack: Attack,
        defender: PokemonCard
    ): boolean {
        // To be implemented
        return false;
    }

    public retreat(pokemon: PokemonCard): boolean {
        // To be implemented
        return false;
    }

    public evolveCard(pokemon: PokemonCard): boolean {
        // To be implemented
        return false;
    }

    public endGame(): void {
        // To be implemented
    }

    public updateProfile(newUsername: string): boolean {
        // To be implemented
        return false;
    }
}