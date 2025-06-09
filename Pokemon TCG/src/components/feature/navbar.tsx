import { Link } from "react-router-dom";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGear,
    faHouse,
    faBurst,
    faClone,
    faStore,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "../assets/UserClass";

interface NavBarProps {
    onSettingsClick: () => void;
    currentUser: User | null;
}

const NavBar: React.FC<NavBarProps> = ({ onSettingsClick, currentUser }) => {
    return (
        <header id="header">
            <div className="navContainer">
                <Link to="/" className="logoContainer">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                <nav className="navBar">
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
                </nav>
                <div className="user-info">
                    {currentUser && (
                        <span className="username">{currentUser.username}</span>
                    )}
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
