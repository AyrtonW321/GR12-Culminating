import { doc, getDoc, setDoc, DocumentSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig.js';
import { PokemonCard } from './PokemonCardsClass.js';
import { 
  BulbasaurCard, 
  IvysaurCard, 
  VenusaurCard, 
  VenusaurEXCard 
} from './BulbasaurEvoClass.js';
import { 
  CharmanderCard, 
  CharmeleonCard, 
  CharizardCard, 
  CharizardEXCard 
} from './CharmanderEvoClass.js';
import { 
  SquirtleCard, 
  WartortleCard, 
  BlastoiseCard, 
  BlastoiseEXCard 
} from './SquirtleEvoClass.js';

// Interface for user data structure in Firestore
export interface UserData {
  username: string;
  email: string;
  currency: number;
  cards: CardCollectionEntry[];
  pfp: string;
}

// Interface for card collection entries
export interface CardCollectionEntry {
  cardData: any; // JSON representation of PokemonCard
  count: number;
}

// Interface for the parsed user data with actual PokemonCard objects
export interface ParsedUserData {
  username: string;
  email: string;
  currency: number;
  cardCollection: Map<PokemonCard, number>;
  pfp: string;
}

// Card class registry for proper deserialization
const CARD_REGISTRY: { [key: string]: new () => PokemonCard } = {
  'Bulbasaur': BulbasaurCard,
  'Ivysaur': IvysaurCard,
  'Venusaur': VenusaurCard,
  'Venusaur EX': VenusaurEXCard,
  'Charmander': CharmanderCard,
  'Charmeleon': CharmeleonCard,
  'Charizard': CharizardCard,
  'Charizard EX': CharizardEXCard,
  'Squirtle': SquirtleCard,
  'Wartortle': WartortleCard,
  'Blastoise': BlastoiseCard,
  'Blastoise-EX': BlastoiseEXCard
};

/**
 * Create a Pokemon card from JSON data using the proper class
 * @param cardData - JSON representation of a Pokemon card
 * @returns PokemonCard instance or null if failed
 */
function createPokemonCardFromData(cardData: any): PokemonCard | null {
  try {
    const pokemonName = cardData._pokemonName;
    const CardClass = CARD_REGISTRY[pokemonName];
    
    if (CardClass) {
      // Create new instance of the specific card class
      return new CardClass();
    } else {
      // Fallback to generic PokemonCard.fromJSON if class not found
      console.warn(`Card class not found for ${pokemonName}, using generic deserialization`);
      return PokemonCard.fromJSON(cardData);
    }
  } catch (error) {
    console.error('Error creating Pokemon card from data:', error);
    return null;
  }
}

/**
 * Get user data from Firestore by user ID
 * @param userId - The user's UID from Firebase Auth
 * @returns Promise<UserData | null> - User data or null if not found
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc: DocumentSnapshot = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log(`User with ID ${userId} not found`);
      return null;
    }
    
    const data = userDoc.data() as UserData;
    
    // Validate required fields
    if (!data.username || !data.email) {
      console.error('Invalid user data: missing required fields');
      return null;
    }
    
    return {
      username: data.username || '',
      email: data.email || '',
      currency: data.currency || 0,
      cards: data.cards || [],
      pfp: data.pfp || ''
    };
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Get user data and parse card collection into Map format
 * @param userId - The user's UID from Firebase Auth
 * @returns Promise<ParsedUserData | null> - Parsed user data with card collection as Map
 */
export async function getParsedUserData(userId: string): Promise<ParsedUserData | null> {
  try {
    const userData = await getUserData(userId);
    
    if (!userData) {
      return null;
    }
    
    // Parse card collection from JSON to Map<PokemonCard, number>
    const cardCollection = new Map<PokemonCard, number>();
    
    if (userData.cards && Array.isArray(userData.cards)) {
      for (const cardEntry of userData.cards) {
        try {
          if (cardEntry.cardData && typeof cardEntry.count === 'number') {
            const pokemonCard = createPokemonCardFromData(cardEntry.cardData);
            if (pokemonCard) {
              cardCollection.set(pokemonCard, cardEntry.count);
            } else {
              console.warn('Failed to parse Pokemon card:', cardEntry.cardData);
            }
          }
        } catch (error) {
          console.error('Error parsing card entry:', cardEntry, error);
        }
      }
    }
    
    return {
      username: userData.username,
      email: userData.email,
      currency: userData.currency,
      cardCollection: cardCollection,
      pfp: userData.pfp
    };
    
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Initialize a new user with test card collection
 * @param userId - The user's UID from Firebase Auth
 * @param userData - Basic user data (username, email, pfp)
 * @returns Promise<boolean> - Success status
 */
export async function initializeNewUser(
  userId: string, 
  userData: { username: string; email: string; pfp?: string }
): Promise<boolean> {
  try {
    // Create test card collection
    const testCards: CardCollectionEntry[] = [
      { cardData: new BulbasaurCard().toJSON(), count: 3 },
      { cardData: new IvysaurCard().toJSON(), count: 2 },
      { cardData: new VenusaurCard().toJSON(), count: 1 },
      { cardData: new CharmanderCard().toJSON(), count: 4 },
      { cardData: new CharmeleonCard().toJSON(), count: 2 },
      { cardData: new CharizardCard().toJSON(), count: 1 },
      { cardData: new CharizardEXCard().toJSON(), count: 1 },
      { cardData: new SquirtleCard().toJSON(), count: 3 },
      { cardData: new WartortleCard().toJSON(), count: 1 },
      { cardData: new BlastoiseCard().toJSON(), count: 1 },
      { cardData: new VenusaurEXCard().toJSON(), count: 1 }
    ];

    const newUserData: UserData = {
      username: userData.username,
      email: userData.email,
      currency: 1000, // Starting currency
      cards: testCards,
      pfp: userData.pfp || ''
    };

    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, newUserData);
    
    console.log(`Initialized new user ${userId} with test collection`);
    return true;
    
  } catch (error) {
    console.error('Error initializing new user:', error);
    return false;
  }
}

/**
 * Add cards to user's collection
 * @param userId - The user's UID from Firebase Auth
 * @param cardsToAdd - Map of PokemonCard to count to add
 * @returns Promise<boolean> - Success status
 */
export async function addCardsToCollection(
  userId: string, 
  cardsToAdd: Map<PokemonCard, number>
): Promise<boolean> {
  try {
    const userData = await getUserData(userId);
    if (!userData) {
      console.error('User not found');
      return false;
    }

    // Convert existing cards to a map for easier manipulation
    const existingCards = new Map<string, { cardData: any; count: number }>();
    userData.cards.forEach(entry => {
      const cardName = entry.cardData._pokemonName;
      existingCards.set(cardName, entry);
    });

    // Add new cards
    for (const [card, count] of cardsToAdd.entries()) {
      const cardName = card.pokemonName;
      if (existingCards.has(cardName)) {
        existingCards.get(cardName)!.count += count;
      } else {
        existingCards.set(cardName, {
          cardData: card.toJSON(),
          count: count
        });
      }
    }

    // Convert back to array
    const updatedCards = Array.from(existingCards.values());

    // Update user data
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { ...userData, cards: updatedCards });
    
    return true;
    
  } catch (error) {
    console.error('Error adding cards to collection:', error);
    return false;
  }
}

/**
 * Check if a user exists in the database
 * @param userId - The user's UID from Firebase Auth
 * @returns Promise<boolean> - True if user exists, false otherwise
 */
export async function userExists(userId: string): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
}

/**
 * Get only the user's basic profile information (no card collection)
 * @param userId - The user's UID from Firebase Auth
 * @returns Promise<Omit<UserData, 'cards'> | null> - Basic user profile data
 */
export async function getUserProfile(userId: string): Promise<Omit<UserData, 'cards'> | null> {
  try {
    const userData = await getUserData(userId);
    
    if (!userData) {
      return null;
    }
    
    // Return user data without the cards collection
    return {
      username: userData.username,
      email: userData.email,
      currency: userData.currency,
      pfp: userData.pfp
    };
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Get only the user's card collection
 * @param userId - The user's UID from Firebase Auth
 * @returns Promise<Map<PokemonCard, number> | null> - User's card collection as Map
 */
export async function getUserCardCollection(userId: string): Promise<Map<PokemonCard, number> | null> {
  try {
    const parsedData = await getParsedUserData(userId);
    return parsedData ? parsedData.cardCollection : null;
  } catch (error) {
    console.error('Error fetching user card collection:', error);
    return null;
  }
}

/**
 * Create a starter collection for testing
 * @returns Map<PokemonCard, number> - Starter collection
 */
export function createStarterCollection(): Map<PokemonCard, number> {
  const collection = new Map<PokemonCard, number>();
  
  // Add starter Pokemon with various counts
  collection.set(new BulbasaurCard(), 3);
  collection.set(new IvysaurCard(), 2);
  collection.set(new VenusaurCard(), 1);
  collection.set(new CharmanderCard(), 4);
  collection.set(new CharmeleonCard(), 2);
  collection.set(new CharizardCard(), 1);
  collection.set(new CharizardEXCard(), 1);
  collection.set(new SquirtleCard(), 3);
  collection.set(new WartortleCard(), 1);
  collection.set(new BlastoiseCard(), 1);
  collection.set(new VenusaurEXCard(), 1);
  
  return collection;
}