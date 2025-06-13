import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
}

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
    setUserData: (user: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUserData }) => {
    const [action, setAction] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const googleProvider = new GoogleAuthProvider();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Basic validation
        if (trimmedUsername.length < 3) {
            alert('Username must be at least 3 characters long');
            setLoading(false);
            return;
        }

        if (trimmedPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
            
            // Update the user's display name
            await updateProfile(userCredential.user, {
                displayName: trimmedUsername
            });

            // Set user data in your app state
            const userData = {
                username: trimmedUsername,
                email: trimmedEmail,
                password: '' // Don't store password in state
            };

            setUserData(userData);
            setIsLoggedIn(true);
            navigate('/');
        } catch (error: any) {
            let errorMessage = 'Registration failed';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Please use a different email or try logging in.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. Please choose a stronger password.';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
            const user = userCredential.user;
            
            const userData = {
                username: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                password: '' // Don't store password in state
            };

            setUserData(userData);
            setIsLoggedIn(true);
            navigate('/');
        } catch (error: any) {
            let errorMessage = 'Login failed';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email. Please register first.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            const userData = {
                username: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                password: '' // Google auth doesn't provide password
            };

            setUserData(userData);
            setIsLoggedIn(true);
            navigate('/');
        } catch (error: any) {
            let errorMessage = 'Google sign-in failed';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Sign-in cancelled. Please try again.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup was blocked. Please allow popups and try again.';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
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
                            <FontAwesomeIcon 
                                className='icon' 
                                icon={showPassword ? faEyeSlash : faEye} 
                                id='eye' 
                            />
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
                        {loading ? 'Signing in...' : 'Login'}
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
                        <FontAwesomeIcon className='icon' icon={faEnvelope} />
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
                            <FontAwesomeIcon 
                                className='icon' 
                                icon={showPassword ? faEyeSlash : faEye} 
                                id='eye' 
                            />
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
                            <FaGoogle/>
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