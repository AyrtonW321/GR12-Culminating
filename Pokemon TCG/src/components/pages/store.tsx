import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faHourglass } from '@fortawesome/free-solid-svg-icons';
import './store.css';

interface StoreProps {
  onHourglassUpdate?: (newAmount: number) => void;
}

const Store = ({ onHourglassUpdate }: StoreProps) => {
  const [coins, setCoins] = useState<number>(1000); // Default starting coins
  const [hourglasses, setHourglasses] = useState<number>(3); // Default starting hourglasses
  const [quantity, setQuantity] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const COINS_PER_HOURGLASS = 50; // Cost of one hourglass
  const MAX_PURCHASE = 20; // Maximum hourglasses that can be bought at once

  // Load user data from localStorage
  useEffect(() => {
    const savedCoins = localStorage.getItem('userCoins');
    const savedHourglasses = localStorage.getItem('userHourglasses');
    
    if (savedCoins) {
      setCoins(parseInt(savedCoins));
    }
    if (savedHourglasses) {
      setHourglasses(parseInt(savedHourglasses));
    }
  }, []);

  // Save user data to localStorage
  const saveUserData = (newCoins: number, newHourglasses: number) => {
    localStorage.setItem('userCoins', newCoins.toString());
    localStorage.setItem('userHourglasses', newHourglasses.toString());
    
    // Notify parent component of hourglass update
    if (onHourglassUpdate) {
      onHourglassUpdate(newHourglasses);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const getTotalCost = () => {
    return quantity * COINS_PER_HOURGLASS;
  };

  const canAffordPurchase = () => {
    return coins >= getTotalCost();
  };

  const handlePurchase = () => {
    const totalCost = getTotalCost();
    
    if (canAffordPurchase()) {
      const newCoins = coins - totalCost;
      const newHourglasses = hourglasses + quantity;
      
      setCoins(newCoins);
      setHourglasses(newHourglasses);
      saveUserData(newCoins, newHourglasses);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset quantity to 1
      setQuantity(1);
    }
  };

  const getMaxAffordable = () => {
    return Math.min(Math.floor(coins / COINS_PER_HOURGLASS), MAX_PURCHASE);
  };

  return (
    <div className="store-container">
      <div className="store-main-display">
        <div className="store-header">
          <h1 className="store-title">Hourglass Store</h1>
        </div>

        <div className="currency-display">
          <div className="coin-icon">
            <FontAwesomeIcon icon={faCoins} />
          </div>
          <div>
            <div className="coin-amount">{coins.toLocaleString()}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Coins Available</div>
          </div>
        </div>

        <div className="purchase-section">
          <h2 className="purchase-title">Buy Hourglasses</h2>
          
          <div className="hourglass-display">
            <div className="hourglass-icon">
              <FontAwesomeIcon icon={faHourglass} />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              You have {hourglasses} hourglasses
            </span>
          </div>

          <div className="purchase-info">
            <strong>{COINS_PER_HOURGLASS} coins</strong> = <strong>1 hourglass</strong>
          </div>

          <div className="quantity-selector">
            
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max={getMaxAffordable() || 1}
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-slider"
                disabled={getMaxAffordable() === 0}
              />
            </div>

            <div className="quantity-display">
              <span className="quantity-text">
                Quantity: {quantity}
              </span>
              <span className="cost-text">
                Cost: {getTotalCost().toLocaleString()} coins
              </span>
            </div>
          </div>

          <button
            className="purchase-button"
            onClick={handlePurchase}
            disabled={!canAffordPurchase() || quantity === 0}
          >
            {canAffordPurchase() 
              ? `Purchase ${quantity} Hourglass${quantity !== 1 ? 'es' : ''}`
              : 'Insufficient Coins'
            }
          </button>

          {!canAffordPurchase() && quantity > 0 && (
            <div className="insufficient-funds">
              You need {(getTotalCost() - coins).toLocaleString()} more coins for this purchase.
            </div>
          )}

          {getMaxAffordable() === 0 && (
            <div className="insufficient-funds">
              You don't have enough coins to buy any hourglasses. 
              Complete missions or battles to earn more coins!
            </div>
          )}

          {showSuccess && (
            <div className="success-message">
              ✅ Successfully purchased {quantity} hourglass{quantity !== 1 ? 'es' : ''}!
              Your hourglasses have been added to your account.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;