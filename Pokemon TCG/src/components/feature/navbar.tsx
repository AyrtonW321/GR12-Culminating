import { Link } from 'react-router-dom';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHouse, faBurst, faClone, faStore, faUser } from '@fortawesome/free-solid-svg-icons';

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface NavBarProps {
    onSettingsClick: () => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    handleSignOut: () => void;
    userData: UserData;
    hourglassCount: number;
}

const NavBar: React.FC<NavBarProps> = ({
    onSettingsClick,
    isLoggedIn,
    setIsLoggedIn,
    handleSignOut,
    userData,
    hourglassCount
}) => {
    return (
        <header id="header">
            <div className="navContainer">
                <Link to="/" className="logoContainer">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                <nav className='navBar'>
                    <Link to="/" aria-label="Home">
                        <FontAwesomeIcon icon={faHouse} />
                    </Link>
                    <Link to="/Collection" aria-label="Collection">
                        <FontAwesomeIcon icon={faClone} />
                    </Link>
                    <Link to="/Battle" aria-label="Battle">
                        <FontAwesomeIcon icon={faBurst} />
                    </Link>
                    <Link to="/Store" aria-label="Store">
                        <FontAwesomeIcon icon={faStore} />
                    </Link>
                    <Link to="/Profile" aria-label="Profile">
                        <FontAwesomeIcon icon={faUser} />
                    </Link>
                </nav>
                <div className="userSection">
                    <div className="hourglassDisplay" title="Hourglasses">
                        <img src="./hourglass.png" alt="Hourglasses" />
                        <span className="hourglassCount">{hourglassCount}</span>
                    </div>
                    <button
                        type="button"
                        onClick={onSettingsClick}
                        className="settingsBtn"
                        aria-label="Open settings"
                        title="Open settings"
                    >
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </div>

            </div>
        </header>
    );
};

export default NavBar;