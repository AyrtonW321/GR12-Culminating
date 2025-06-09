import "./battle.css";
import { User } from '../assets/UserClass';

interface BattleProps {
    currentUser: User | null;
}

const Battle = ({ currentUser }: BattleProps) => {
    return (
        <div className="battle-container">
            {currentUser && <h1>Battle Mode - {currentUser.username}</h1>}
            {/* Add your battle content here */}
        </div>
    );
};

export default Battle;