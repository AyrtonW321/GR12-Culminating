import React, { useState } from 'react';
import { User } from "../assets/UserClass";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './login.css';

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
    setUserData: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUserData }) => {
    const [action, setAction] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    function isValidEmail(email: string) {
        const trimmedEmail = email.trim();
        const commonSuffixes = ['gmail.com', 'yahoo.com', 'hotmail.com', 'gapps.yrdsb.ca'];
        const emailDomain = trimmedEmail.substring(trimmedEmail.lastIndexOf('@') + 1);
        return commonSuffixes.includes(emailDomain);
    }

    function isValidPassword(password: string) {
        if (password.length < 8) return false;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) return false;
        if (password.toLowerCase() === password) return false;
        return containsNumber(password);
    }

    function containsNumber(input: string) {
        return input.split('').some(char => !isNaN(parseInt(char)));
    }

    const getUsersFromStorage = (): Map<string, User> => {
        const usersJson = localStorage.getItem('users');
        if (!usersJson) return new Map();
        
        try {
            const usersData = JSON.parse(usersJson);
            const usersMap = new Map<string, User>();
            
            for (const [username, userJson] of Object.entries(usersData)) {
                usersMap.set(username, User.fromJSON(userJson));
            }
            
            return usersMap;
        } catch (error) {
            console.error('Error parsing users from localStorage:', error);
            return new Map();
        }
    };

    const saveUsersToStorage = (users: Map<string, User>) => {
        const usersObject: Record<string, any> = {};
        users.forEach((user, username) => {
            usersObject[username] = user.toJSON();
        });
        localStorage.setItem('users', JSON.stringify(usersObject));
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 15 || trimmedUsername[0] !== trimmedUsername[0].toUpperCase()) {
            alert('Username must be within 3 and 15 characters long, and start with a capital letter');
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            alert('Invalid email address');
            return;
        }

        if (!isValidPassword(trimmedPassword)) {
            alert('Invalid password. Must be at least 8 characters long, contain at least one special character, one capital letter, and one number.');
            return;
        }

        const users = getUsersFromStorage();
        if (users.has(trimmedUsername)) {
            alert('User already exists');
            return;
        }

        // Create new user with the User class
        const newUser = new User(trimmedUsername, trimmedEmail, trimmedPassword);

        // Save the user
        users.set(trimmedUsername, newUser);
        saveUsersToStorage(users);

        // Set as logged in user
        localStorage.setItem('loggedInUser', JSON.stringify(newUser.toJSON()));
        setUserData(newUser);
        setIsLoggedIn(true);
        alert('User registration successful');
        navigate('/', { state: { user: newUser } });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const inputUsername = username.trim();
        const inputPassword = password.trim();
        const users = getUsersFromStorage();
        const matchedUser = users.get(inputUsername);

        if (!matchedUser) {
            alert('User not found');
            return;
        }

        if (matchedUser.password !== inputPassword) {
            alert('Incorrect password');
            return;
        }

        alert('Login successful');
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser.toJSON()));
        setUserData(matchedUser);
        setIsLoggedIn(true);
        navigate('/',  { state: { user: matchedUser } });
    };

    const registerLink = () => setAction(' active');
    const loginLink = () => setAction('');
    const toggleShowPassword = () => setShowPassword(prev => !prev);

    return (
        <div className={`container${action}`}>
            <div className='formBox login'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className='inputBox'>
                        <input
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                        />
                        <FontAwesomeIcon className='icon' icon={faUser} />
                    </div>
                    <div className='inputBox'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={toggleShowPassword}>
                            {showPassword ? <FontAwesomeIcon className='icon' icon={faEyeSlash} id='eye' />
                             : <FontAwesomeIcon className='icon' icon={faEye} id='eye' />}
                        </button>
                        <FontAwesomeIcon className='icon' icon={faLock}/>
                    </div>
                    <div className='rememberForgot'>
                        <label>
                            <input className='checkbox' type='checkbox' />
                            Remember me
                        </label>
                        <a href='#'>Forgot Password?</a>
                    </div>
                    <button className='submit' type='submit'>Login</button>
                    <div className='register'>
                        <p>Don't have an account? <a href='#' onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>
            <div className='formBox register'>
                <form onSubmit={handleRegister}>
                    <h1>Register Account</h1>
                    <div className='inputBox'>
                        <input
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <FontAwesomeIcon className='icon' icon={faUser} />
                    </div>
                    <div className='inputBox'>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FontAwesomeIcon className='icon' icon={faEnvelope}/>
                    </div>
                    <div className='inputBox'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={toggleShowPassword}>
                            {showPassword ? <FontAwesomeIcon className='icon' icon={faEyeSlash} id='eye' /> : <FontAwesomeIcon className='icon' icon={faEye} id='eye' />}
                        </button>
                        <FontAwesomeIcon className='icon' icon={faLock}/>
                    </div>
                    <div className='rememberForgot'>
                        <label>
                            <input className='checkbox' type='checkbox' required />
                            I agree to the terms & conditions
                        </label>
                    </div>
                    <button className='submit' type='submit'>Register</button>
                    <div className='register'>
                        <p>Already have an account? <a href='#' onClick={loginLink}>Log In</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;