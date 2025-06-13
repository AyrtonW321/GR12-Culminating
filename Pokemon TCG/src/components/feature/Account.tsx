import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { auth } from "../assets/firebaseConfig";
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
}

interface AccountProps {
    userData: UserData;
    setIsLoggedIn: (value: boolean) => void;
    setUserData: (data: UserData) => void;
}

const Account: React.FC<AccountProps> = ({ userData, setIsLoggedIn, setUserData }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(userData.username);
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            setUserData({ username: '', email: '', password: '' });
            navigate('/login');
        } catch (error: any) {
            alert(`Error signing out: ${error.message}`);
        }
    };

    const handleUpdateProfile = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        setLoading(true);
        try {
            // Update display name
            if (newUsername !== userData.username) {
                await updateProfile(currentUser, {
                    displayName: newUsername
                });
            }

            // Update password if provided
            if (newPassword && currentPassword) {
                // Re-authenticate user before changing password
                const credential = EmailAuthProvider.credential(
                    currentUser.email!,
                    currentPassword
                );
                await reauthenticateWithCredential(currentUser, credential);
                await updatePassword(currentUser, newPassword);
            }

            // Update local state
            setUserData({
                username: newUsername,
                email: userData.email,
                password: '' // Don't store password in state
            });

            setCurrentPassword('');
            setNewPassword('');
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error: any) {
            let errorMessage = 'Failed to update profile';
            
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = 'Current password is incorrect';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'New password is too weak';
                    break;
                case 'auth/requires-recent-login':
                    errorMessage = 'Please log out and log back in before updating your profile';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );
        if (!confirmDelete) return;

        const password = window.prompt(
            'Please enter your current password to confirm account deletion:'
        );
        if (!password) return;

        const currentUser = auth.currentUser;
        if (!currentUser) return;

        setLoading(true);
        try {
            // Re-authenticate before deletion
            const credential = EmailAuthProvider.credential(
                currentUser.email!,
                password
            );
            await reauthenticateWithCredential(currentUser, credential);
            
            // Delete the user
            await deleteUser(currentUser);
            
            setIsLoggedIn(false);
            setUserData({ username: '', email: '', password: '' });
            navigate('/login');
            alert('Account deleted successfully');
        } catch (error: any) {
            let errorMessage = 'Failed to delete account';
            
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Account deletion cancelled.';
                    break;
                case 'auth/requires-recent-login':
                    errorMessage = 'For security reasons, please log out and log back in before deleting your account.';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const currentUser = auth.currentUser;
    const isGoogleUser = currentUser?.providerData.some(provider => provider.providerId === 'google.com');

    return (
        <div className='accountContainer'>
            <h1>My Account</h1>
            <hr />
            
            <div className='accountInfo'>
                <h2>Personal Information</h2>
                
                <div className='profile-section'>
                    <label htmlFor='username'>Username:</label>
                    <div className='inputBox2'>
                        <input
                            id='username'
                            className='profile-input'
                            value={isEditing ? newUsername : userData.username}
                            onChange={(e) => setNewUsername(e.target.value)}
                            disabled={!isEditing || loading}
                        />
                    </div>
                </div>

                <div className='profile-section'>
                    <label htmlFor='email'>Email:</label>
                    <div className='inputBox2'>
                        <input
                            id='email'
                            className='profile-input'
                            value={userData.email}
                            disabled
                        />
                    </div>
                </div>

                <div className='profile-section'>
                    <label htmlFor='provider'>Sign-in Method:</label>
                    <div className='inputBox2'>
                        <input
                            id='provider'
                            className='profile-input'
                            value={isGoogleUser ? 'Google' : 'Email/Password'}
                            disabled
                        />
                    </div>
                </div>

                {isEditing && !isGoogleUser && (
                    <>
                        <div className='profile-section'>
                            <label htmlFor='currentPassword'>Current Password:</label>
                            <div className='inputBox2'>
                                <input
                                    id='currentPassword'
                                    type='password'
                                    className='profile-input'
                                    placeholder='Enter current password'
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className='profile-section'>
                            <label htmlFor='newPassword'>New Password (optional):</label>
                            <div className='inputBox2'>
                                <input
                                    id='newPassword'
                                    type='password'
                                    className='profile-input'
                                    placeholder='Enter new password or leave blank'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            <hr />

            <div className='accountButtons'>
                {!isEditing ? (
                    <div className='edit-profile'>
                        <button 
                            onClick={() => setIsEditing(true)}
                            disabled={loading}
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className='edit-actions'>
                        <button 
                            onClick={handleUpdateProfile}
                            disabled={loading || (!Boolean(newUsername.trim()) || (Boolean(newPassword) && !Boolean(currentPassword)))}
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