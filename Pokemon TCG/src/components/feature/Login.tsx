import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaGoogle } from 'react-icons/fa';
import './login.css';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from "firebase/auth";
import { auth } from "../assets/firebaseConfig";

interface UserData {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
    wins?: number;
    losses?: number;
    currentStreak?: number;
    collectedCards?: number;
}

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
    setUserData: (user: UserData) => void;
    initializeUserInLocalStorage: (firebaseUser: any, additionalData?: Partial<UserData>) => UserData;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUserData, initializeUserInLocalStorage }) => {
    const [action, setAction] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const googleProvider = new GoogleAuthProvider();

    const saveToLocalStorage = (user: UserData) => {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        const usersJson = localStorage.getItem('users');
        const users = usersJson ? JSON.parse(usersJson) : {};
        users[user.username] = user;
        localStorage.setItem('users', JSON.stringify(users));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 15 || trimmedUsername[0] !== trimmedUsername[0].toUpperCase()) {
            alert('Username must be between 3-15 characters and start with a capital letter.');
            setLoading(false);
            return;
        }

        if (trimmedPassword.length < 8 || !/[!@#$%^&*]/.test(trimmedPassword) || trimmedPassword === trimmedPassword.toLowerCase() || !/\d/.test(trimmedPassword)) {
            alert('Password must be 8+ characters, include a capital letter, special character, and a number.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
            await updateProfile(userCredential.user, { displayName: trimmedUsername });

            // Initialize user in Firestore
            await initializeNewUser(userCredential.user.uid, {
                username: trimmedUsername,
                email: trimmedEmail,
                password: trimmedPassword
            };

            saveToLocalStorage(newUser);
            setUserData(newUser);
            setIsLoggedIn(true);
            alert('Registration successful!');
            navigate('/');

        } catch (error: any) {
            let message = 'Registration failed';
            if (error.code === 'auth/email-already-in-use') message = 'Email already in use';
            if (error.code === 'auth/invalid-email') message = 'Invalid email';
            if (error.code === 'auth/weak-password') message = 'Weak password';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
            const firebaseUser = userCredential.user;

            const loadedUser: UserData = {
                username: firebaseUser.displayName || email.split('@')[0],
                email: firebaseUser.email || '',
                password: '' // Never store raw password after login
            };

            setUserData(loadedUser);
            setIsLoggedIn(true);
            localStorage.setItem('loggedInUser', JSON.stringify(loadedUser));
            navigate('/');

        } catch (error: any) {
            let message = 'Login failed';
            if (error.code === 'auth/user-not-found') message = 'User not found';
            if (error.code === 'auth/wrong-password') message = 'Incorrect password';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const googleUser: UserData = {
                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                password: ''
            };

            saveToLocalStorage(googleUser);
            setUserData(googleUser);
            setIsLoggedIn(true);
            navigate('/');

        } catch (error: any) {
            alert('Google sign-in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const registerLink = () => setAction(' active');
    const loginLink = () => setAction('');

    return (
        <div className={`container${action}`}>
            <div className='formBox login'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>

                    <div className='inputBox'>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <FontAwesomeIcon className='icon' icon={faEnvelope} />
                    </div>

                    <div className='inputBox'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button type="button" onClick={toggleShowPassword} disabled={loading}>
                            <FontAwesomeIcon className='icon' icon={showPassword ? faEyeSlash : faEye} id='eye' />
                        </button>
                        <FontAwesomeIcon className='icon' icon={faLock} />
                    </div>

                    <div className='rememberForgot'>
                        <label>
                            <input className='checkbox' type='checkbox' disabled={loading} />
                            Remember me
                        </label>
                        <a href='#'>Forgot Password?</a>
                    </div>

                    <button className='submit' type='submit' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className='google-signin'>
                        <button
                            type='button'
                            className='google-btn'
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <FaGoogle />
                            Sign in with Google
                        </button>
                    </div>

                    <div className='register'>
                        <p>Don't have an account? <a href='#' onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>

            <div className='formBox register'>
                <form onSubmit={handleRegister}>
                    <h1>Create Account</h1>

                    <div className='inputBox'>
                        <input
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
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
                            disabled={loading}
                        />
                        <FontAwesomeIcon className='icon' icon={faEnvelope} />
                    </div>

                    <div className='inputBox'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button type="button" onClick={toggleShowPassword} disabled={loading}>
                            <FontAwesomeIcon className='icon' icon={showPassword ? faEyeSlash : faEye} id='eye' />
                        </button>
                        <FontAwesomeIcon className='icon' icon={faLock} />
                    </div>

                    <div className='rememberForgot'>
                        <label>
                            <input className='checkbox' type='checkbox' required disabled={loading} />
                            I agree to the terms & conditions
                        </label>
                    </div>

                    <button className='submit' type='submit' disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>

                    <div className='google-signin'>
                        <button
                            type='button'
                            className='google-btn'
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <FaGoogle />
                            Sign up with Google
                        </button>
                    </div>

                    <div className='register'>
                        <p>Already have an account? <a href='#' onClick={loginLink}>Log In</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
