import { doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig.js';
import { PokemonCard } from './PokemonCardsClass.js';

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
            const pokemonCard = PokemonCard.fromJSON(cardEntry.cardData);
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