import React, { useState, useMemo } from 'react';
import { useUser } from '../feature/usercontext';
import { PokemonCard } from '../assets/PokemonCardsClass';
import './collection.css';

interface CollectionFilters {
  name: string;
  type: string;
  minRarity: number;
  maxRarity: number;
  sortBy: 'name' | 'rarity' | 'hp' | 'count';
  sortOrder: 'asc' | 'desc';
}

const Collection: React.FC = () => {
  const { user, isLoggedIn, isLoading, cardCollection, error, refreshUserData } = useUser();
  
  const [filters, setFilters] = useState<CollectionFilters>({
    name: '',
    type: '',
    minRarity: 1,
    maxRarity: 8,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Filter and sort the collection
  const filteredCards = useMemo(() => {
    if (!cardCollection || cardCollection.size === 0) return [];

    const results: { card: PokemonCard; count: number }[] = [];
    
    // Convert Map to array and apply filters
    for (const [card, count] of cardCollection.entries()) {
      // Name filter
      if (filters.name && !card.pokemonName.toLowerCase().includes(filters.name.toLowerCase())) {
        continue;
      }
      
      // Type filter
      if (filters.type && card.type !== filters.type) {
        continue;
      }
      
      // Rarity filters
      if (card.Rarity < filters.minRarity || card.Rarity > filters.maxRarity) {
        continue;
      }
      
      results.push({ card, count });
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.card.pokemonName.localeCompare(b.card.pokemonName);
          break;
        case 'rarity':
          comparison = a.card.Rarity - b.card.Rarity;
          break;
        case 'hp':
          comparison = a.card.hp - b.card.hp;
          break;
        case 'count':
          comparison = a.count - b.count;
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return results;
  }, [cardCollection, filters]);

  // Get unique types for filter dropdown
  const availableTypes = useMemo(() => {
    if (!cardCollection || cardCollection.size === 0) return [];
    const types = new Set<string>();
    for (const [card] of cardCollection.entries()) {
      if (card.type) {
        types.add(card.type);
      }
    }
    return Array.from(types).sort();
  }, [cardCollection]);

  if (isLoading) {
    return (
      <div className="collection-container">
        <div className="loading-message">Loading your collection...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="collection-container">
        <div className="login-message">Please log in to view your collection.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collection-container">
        <div className="error-message">
          {error}
          <button onClick={refreshUserData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="collection-container">
        <div className="error-message">Failed to load user data.</div>
      </div>
    );
  }

  const totalCards = Array.from(cardCollection.values()).reduce((sum, count) => sum + count, 0);
  const uniqueCards = cardCollection.size;

  return (
    <div className="collection-container">
      <div className="collection-header">
        <h1>Your Collection</h1>
        <div className="collection-stats">
          <span>Total Cards: {totalCards}</span>
          <span>Unique Cards: {uniqueCards}</span>
          <span>Currency: {user.currency}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="collection-filters">
        <div className="filter-group">
          <label htmlFor="name-filter">Search by name:</label>
          <input
            id="name-filter"
            type="text"
            value={filters.name}
            onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Pokemon name..."
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="min-rarity">Min Rarity:</label>
          <input
            id="min-rarity"
            type="number"
            min="1"
            max="8"
            value={filters.minRarity}
            onChange={(e) => setFilters(prev => ({ ...prev, minRarity: parseInt(e.target.value) || 1 }))}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="max-rarity">Max Rarity:</label>
          <input
            id="max-rarity"
            type="number"
            min="1"
            max="8"
            value={filters.maxRarity}
            onChange={(e) => setFilters(prev => ({ ...prev, maxRarity: parseInt(e.target.value) || 8 }))}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as CollectionFilters['sortBy'] }))}
          >
            <option value="name">Name</option>
            <option value="rarity">Rarity</option>
            <option value="hp">HP</option>
            <option value="count">Count</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-order">Order:</label>
          <select
            id="sort-order"
            value={filters.sortOrder}
            onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="collection-grid">
        {filteredCards.length === 0 ? (
          <div className="no-cards-message">
            {uniqueCards === 0 
              ? "Your collection is empty. Open some packs!" 
              : "No cards match your current filters."
            }
          </div>
        ) : (
          filteredCards.map(({ card, count }, index) => (
            <div key={`${card.pokemonName}-${card.Rarity}-${index}`} className="card-item">
              <div className="card-image-container">
                {card.pokemonPhoto ? (
                  <img 
                    src={card.pokemonPhoto} 
                    alt={card.pokemonName}
                    className="card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="card-placeholder">{card.pokemonName}</div>
                )}
                <div className="card-count">{count}x</div>
              </div>
              
              <div className="card-details">
                <h3 className="card-name">{card.pokemonName} {card.isEX ? 'EX' : ''}</h3>
                <div className="card-info">
                  <span className={`card-type ${card.type?.toLowerCase()}`}>{card.type}</span>
                  <span className="card-hp">{card.hp} HP</span>
                  <span className={`card-rarity rarity-${card.Rarity}`}>★{card.Rarity}</span>
                </div>
                
                {card.Attacks && card.Attacks.length > 0 && (
                  <div className="card-attacks">
                    {card.Attacks.slice(0, 2).map((attack, attackIndex) => (
                      <div key={attackIndex} className="attack-info">
                        <span className="attack-name">{attack.Name}</span>
                        <span className="attack-damage">{attack.Damage}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Collection;