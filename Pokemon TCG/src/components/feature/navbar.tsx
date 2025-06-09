import { Link } from 'react-router-dom';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHouse, faBurst, faClone, faStore } from '@fortawesome/free-solid-svg-icons';

interface NavBarProps {
    onSettingsClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSettingsClick }) => {
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
                    <Link to="/Collaction" aria-label="Collection">
                        <FontAwesomeIcon icon={faClone} />
                    </Link>
                    <Link to="/Battle" aria-label="Battle">
                        <FontAwesomeIcon icon={faBurst} />
                    </Link>
                    <Link to="/Store" aria-label="Store">
                        <FontAwesomeIcon icon={faStore}/>
                    </Link>
                </nav>
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
        </header>
    );
};

export default NavBar;