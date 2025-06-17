
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { auth } from '../assets/firebaseConfig';
import {
    deleteUser,
    signOut,
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';

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

interface AccountProps {
    userData: UserData;
    setIsLoggedIn: (value: boolean) => void;
    setUserData: (data: UserData) => void;
    onUserDataUpdate: (userData: UserData) => void;
}

const Account: React.FC<AccountProps> = ({ userData, setIsLoggedIn, setUserData, onUserDataUpdate }) => {
    const navigate = useNavigate();
    const currentUser = auth.currentUser;
    const isGoogleUser = currentUser?.providerData.some(p => p.providerId === 'google.com');
    
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(userData.username);
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Firebase sign out failed:', err);
        }

        setIsLoggedIn(false);
        setUserData({ username: '', email: '', password: '' });
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    const handleUpdateProfile = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            if (newUsername !== userData.username) {
                await updateProfile(currentUser, { displayName: newUsername });
            }

            if (newPassword && !isGoogleUser) {
                const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);
                await updatePassword(currentUser, newPassword);
            }

            const updatedUser: UserData = {
                username: newUsername,
                email: userData.email,
                password: '' // don't store actual password
            };

            setUserData(updatedUser);
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

            const users = JSON.parse(localStorage.getItem('users') || '{}');
            users[updatedUser.username] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));

            setIsEditing(false);
            setCurrentPassword('');
            setNewPassword('');
            alert('Profile updated!');
        } catch (error: any) {
            let message = 'Failed to update profile';
            if (error.code === 'auth/wrong-password') message = 'Incorrect current password';
            if (error.code === 'auth/weak-password') message = 'Password is too weak';
            if (error.code === 'auth/requires-recent-login') message = 'Please log in again before updating profile';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
        if (!confirmDelete) return;

        const password = isGoogleUser
            ? null
            : prompt('Enter your current password to confirm account deletion:');
        if (!isGoogleUser && !password) return;

        setLoading(true);
        try {
            if (!currentUser) throw new Error('No current user');

            if (!isGoogleUser) {
                const credential = EmailAuthProvider.credential(currentUser.email!, password!);
                await reauthenticateWithCredential(currentUser, credential);
            }

            await deleteUser(currentUser);

            const users = JSON.parse(localStorage.getItem('users') || '{}');
            delete users[userData.username];
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem('loggedInUser');

            setIsLoggedIn(false);
            setUserData({ username: '', email: '', password: '' });
            navigate('/login');
            alert('Account deleted');
        } catch (error: any) {
            let message = 'Failed to delete account';
            if (error.code === 'auth/wrong-password') message = 'Incorrect password';
            if (error.code === 'auth/requires-recent-login') message = 'Please log in again before deleting account';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='accountContainer'>
            <h1>My Account</h1>
            <hr />
            <div className='accountInfo'>
                <h2>Personal Information</h2>

                <label htmlFor='enteredUsername'>Username:</label>
                <div className='inputBox2 userUsername'>
                    <input
                        className='enteredUsername'
                        value={isEditing ? newUsername : userData.username}
                        onChange={(e) => setNewUsername(e.target.value)}
                        disabled={!isEditing || loading}
                    />
                </div>

                <label htmlFor='enteredEmail'>Email:</label>
                <div className='inputBox2 userEmail'>
                    <input
                        className='enteredEmail'
                        value={userData.email}
                        disabled
                    />
                </div>

                <label htmlFor='enteredMethod'>Sign-in Method:</label>
                <div className='inputBox2 userEmail'>
                    <input
                        className='enteredEmail'
                        value={isGoogleUser ? 'Google' : 'Email/Password'}
                        disabled
                    />
                </div>

                {!isGoogleUser && isEditing && (
                    <>
                        <label htmlFor='enteredCurrentPassword'>Current Password:</label>
                        <div className='inputBox2 userPassword'>
                            <input
                                type='password'
                                value={currentPassword}
                                placeholder='Current password'
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <label htmlFor='enteredNewPassword'>New Password (optional):</label>
                        <div className='inputBox2 userPassword'>
                            <input
                                type='password'
                                value={newPassword}
                                placeholder='New password'
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}
            </div>
            <hr />
            <div className='accountButtons'>
                {!isEditing ? (
                    <div className='edit-profile'>
                        <button onClick={() => setIsEditing(true)} disabled={loading}>
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className='edit-actions'>
                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading || !newUsername.trim()}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNewUsername(userData.username);
                                setNewPassword('');
                                setCurrentPassword('');
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <div className='accountSignOut'>
                    <button onClick={handleSignOut} disabled={loading}>
                        Sign Out
                    </button>
                </div>

                <div className='accountDelete'>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className='delete-btn'
                    >
                        {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Account;
