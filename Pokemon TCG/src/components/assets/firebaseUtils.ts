import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentSnapshot,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './firebaseConfig.js';
import { PokemonCard } from './PokemonCardsClass.js';
import {
  BulbasaurCard,
  IvysaurCard,
  VenusaurCard,
  VenusaurEXCard,
} from './BulbasaurEvoClass.js';
import {
  CharmanderCard,
  CharmeleonCard,
  CharizardCard,
  CharizardEXCard,
} from './CharmanderEvoClass.js';
import {
  SquirtleCard,
  WartortleCard,
  BlastoiseCard,
  BlastoiseEXCard,
} from './SquirtleEvoClass.js';

export interface UserData {
  username: string;
  email: string;
  currency: number;
  cards: CardCollectionEntry[];
  pfp: string;
}

export interface CardCollectionEntry {
  cardData: any;
  count: number;
}

export interface ParsedUserData {
  username: string;
  email: string;
  currency: number;
  cardCollection: Map<PokemonCard, number>;
  pfp: string;
}

const CARD_REGISTRY: { [key: string]: new () => PokemonCard } = {
  Bulbasaur: BulbasaurCard,
  Ivysaur: IvysaurCard,
  Venusaur: VenusaurCard,
  'Venusaur EX': VenusaurEXCard,
  Charmander: CharmanderCard,
  Charmeleon: CharmeleonCard,
  Charizard: CharizardCard,
  'Charizard EX': CharizardEXCard,
  Squirtle: SquirtleCard,
  Wartortle: WartortleCard,
  Blastoise: BlastoiseCard,
  'Blastoise-EX': BlastoiseEXCard,
};

function createPokemonCardFromData(cardData: any): PokemonCard | null {
  try {
    const pokemonName = cardData._pokemonName;
    const CardClass = CARD_REGISTRY[pokemonName];
    return CardClass ? new CardClass() : PokemonCard.fromJSON(cardData);
  } catch (error) {
    console.error('Error creating card from data:', error);
    return null;
  }
}

export async function getUserProfileData(uid: string) {
  const docRef = doc(db, 'users', uid); // ✅ fixed collection name
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('User data not found');
  return docSnap.data();
}

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc: DocumentSnapshot = await getDoc(userDocRef);
    if (!userDoc.exists()) return null;
    const data = userDoc.data() as UserData;
    if (!data.username || !data.email) return null;
    return {
      username: data.username,
      email: data.email,
      currency: data.currency || 0,
      cards: data.cards || [],
      pfp: data.pfp || '',
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function getParsedUserData(userId: string): Promise<ParsedUserData | null> {
  try {
    const userData = await getUserData(userId);
    if (!userData) return null;

    const cardCollection = new Map<PokemonCard, number>();
    for (const entry of userData.cards || []) {
      const card = createPokemonCardFromData(entry.cardData);
      if (card) cardCollection.set(card, entry.count);
    }

    return {
      username: userData.username,
      email: userData.email,
      currency: userData.currency,
      cardCollection,
      pfp: userData.pfp,
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

export async function initializeNewUser(
  userId: string,
  userData: { username: string; email: string; pfp?: string }
): Promise<boolean> {
  try {
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
      { cardData: new VenusaurEXCard().toJSON(), count: 1 },
    ];

    const newUserData: UserData = {
      username: userData.username,
      email: userData.email,
      currency: 1000,
      cards: testCards,
      pfp: userData.pfp || '',
    };

    await setDoc(doc(db, 'users', userId), newUserData);
    console.log(`Initialized new user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error initializing user:', error);
    return false;
  }
}

export async function addCardsToCollection(
  userId: string,
  cardsToAdd: Map<PokemonCard, number>
): Promise<boolean> {
  try {
    const userData = await getUserData(userId);
    if (!userData) return false;

    const cardMap = new Map<string, CardCollectionEntry>();
    userData.cards.forEach((entry) => {
      cardMap.set(entry.cardData._pokemonName, entry);
    });

    for (const [card, count] of cardsToAdd.entries()) {
      const name = card.pokemonName;
      if (cardMap.has(name)) {
        cardMap.get(name)!.count += count;
      } else {
        cardMap.set(name, { cardData: card.toJSON(), count });
      }
    }

    const updatedCards = Array.from(cardMap.values());
    await setDoc(doc(db, 'users', userId), { ...userData, cards: updatedCards });

    return true;
  } catch (error) {
    console.error('Error adding cards:', error);
    return false;
  }
}

export async function userExists(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}

export async function getUserProfile(
  userId: string
): Promise<Omit<UserData, 'cards'> | null> {
  const data = await getUserData(userId);
  if (!data) return null;
  return {
    username: data.username,
    email: data.email,
    currency: data.currency,
    pfp: data.pfp,
  };
}

export async function getUserCardCollection(
  userId: string
): Promise<Map<PokemonCard, number> | null> {
  const parsed = await getParsedUserData(userId);
  return parsed?.cardCollection || null;
}

export function createStarterCollection(): Map<PokemonCard, number> {
  const collection = new Map<PokemonCard, number>();
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

export async function createUserData({
  uid,
  email,
  username,
}: {
  uid: string;
  email: string;
  username: string;
}) {
  await setDoc(doc(db, 'users', uid), {
    username,
    email,
    currency: 0,
    cards: [],
    pfp: '',
  });
}