// import the necessary libraries and components
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { User } from "../assets/UserClass.js";
import './store.css';

// interface for store
interface StoreProps {
  onHourglassUpdate?: (newAmount: number) => void;
}

// Store component
const Store = ({ onHourglassUpdate }: StoreProps) => {
  const [coins, setCoins] = useState<number>(1000);
  const [hourglasses, setHourglasses] = useState<number>(12);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // max constants
  const COINS_PER_HOURGLASS = 50;
  const MAX_PURCHASE = 20;

  // Update the useEffect hook
  useEffect(() => {
      // Load user from localStorage and sync hourglasses
      const stored = localStorage.getItem("loggedInUser");
      if (stored) {
          const loadedUser = User.fromJSON(JSON.parse(stored));
          loadedUser.syncHourglassesWithLocalStorage();
          setUser(loadedUser);
          setHourglasses(loadedUser.getCurrentHourglasses());

          // Load coins with username
          const savedCoins = localStorage.getItem(`userCoins_${loadedUser.username}`);
          if (savedCoins) {
              setCoins(parseInt(savedCoins));
          } else {
              // Initialize with default value
              localStorage.setItem(`userCoins_${loadedUser.username}`, '1000');
              setCoins(1000);
          }
      } else {
          // Fallback behavior if no user data
          const savedCoins = localStorage.getItem('userCoins');
          if (savedCoins) {
              setCoins(parseInt(savedCoins));
          }
          
          const savedHourglasses = localStorage.getItem('userHourglasses');
          if (savedHourglasses) {
              setHourglasses(parseInt(savedHourglasses));
          } else {
              localStorage.setItem('userHourglasses', '12');
          }
      }
  }, []);

  // Save user data to localStorage and update User class
  const saveUserData = (newCoins: number, newHourglasses: number) => {
      if (user) {
          // Store coins with username
          localStorage.setItem(`userCoins_${user.username}`, newCoins.toString());

          // Update user class hourglasses (this also updates localStorage with username)
          const currentHourglasses = user.getCurrentHourglasses();
          const difference = newHourglasses - currentHourglasses;

          if (difference > 0) {
              user.addHourglass(difference);
          } else if (difference < 0) {
              user.subtractHourglass(Math.abs(difference));
          }

          // Save updated user to localStorage
          localStorage.setItem("loggedInUser", JSON.stringify(user.toJSON()));

          // Update the actual users database object
          const usersRaw = localStorage.getItem("users");
          if (usersRaw) {
              const users = JSON.parse(usersRaw);
              users[user.username] = user.toJSON();
              localStorage.setItem("users", JSON.stringify(users));
          }
      } else {
          // Fallback if no user class
          localStorage.setItem('userCoins', newCoins.toString());
          localStorage.setItem('userHourglasses', newHourglasses.toString());
      }

      // Notify parent component of hourglass update
      if (onHourglassUpdate) {
          onHourglassUpdate(newHourglasses);
      }
  };

  // handle the quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  // function to get the total cost of hourglasses selected
  const getTotalCost = () => {
    return quantity * COINS_PER_HOURGLASS;
  };

  // see if the user can afford
  const canAffordPurchase = () => {
    return coins >= getTotalCost();
  };

  // functionto handle the purchase
  const handlePurchase = () => {
      const totalCost = getTotalCost();

      if (canAffordPurchase()) {
          const newCoins = coins - totalCost;
          const newHourglasses = hourglasses + quantity;

          setCoins(newCoins);
          setHourglasses(newHourglasses);
          saveUserData(newCoins, newHourglasses);

          // Mark store as visited for missions - NOW WITH USERNAME
          if (user) {
              localStorage.setItem(`storeVisited_${user.username}`, 'true');
          } else {
              localStorage.setItem('storeVisited', 'true'); // fallback
          }

          // Show success message
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);

          // Reset quantity to 1
          setQuantity(1);
      }
  };

  // function to get the maximum affordable hourglasses
  const getMaxAffordable = () => {
    return Math.min(Math.floor(coins / COINS_PER_HOURGLASS), MAX_PURCHASE);
  };

  // render
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