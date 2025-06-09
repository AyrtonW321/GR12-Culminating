import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './login.css';

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
    setUserData: (data: { username: string; email: string; password: string }) => void;
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

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some((user: any) => user.username === trimmedUsername)) {
            alert('User already exists');
        } else {
            const newUser = { username: trimmedUsername, email: trimmedEmail, password: trimmedPassword };
            const updatedUsers = [...users, newUser];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            localStorage.setItem('loggedInUser', JSON.stringify(newUser));
            alert('User registration successful');
            setUserData(newUser);
            setIsLoggedIn(true);
            navigate('/');
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const inputUsername = username.trim();
        const inputPassword = password.trim();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const matchedUser = users.find((user: any) => user.username === inputUsername);

        if (!matchedUser) {
            alert('User not found');
            return;
        }

        if (matchedUser.password !== inputPassword) {
            alert('Incorrect password');
            return;
        }

        alert('Login successful');
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
        setUserData(matchedUser);
        setIsLoggedIn(true);
        navigate('/');
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