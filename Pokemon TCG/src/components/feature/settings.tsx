// import the necessary libraries and components
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../assets/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import './settings.css';
// interface for the user data
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

// setting interface 
interface SettingsProps {
    closeModal: () => void;
    isLoggedIn: boolean;
    userData: UserData;
    onUserDataUpdate: (userData: UserData) => void;
}

// interface for the form data 
interface FormData {
    username: string;
    email: string;
    profileImage: string;
}

// settings component
const Settings = ({ closeModal, isLoggedIn, userData, onUserDataUpdate }: SettingsProps) => {
    // hooks for the settings
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    // state for the form data
    const [formData, setFormData] = useState<FormData>({
        username: currentUser?.displayName || userData.username,
        email: currentUser?.email || userData.email,
        profileImage: localStorage.getItem(`profileImage_${userData.username}`) || '/default-pfp.png'
    });
    const [loading, setLoading] = useState(false);

    // function to handle the input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // function to handle the image changes
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFormData(prev => ({
                        ...prev,
                        profileImage: event.target?.result as string
                    }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // function to handle the form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        localStorage.setItem(`profileImage_${userData.username}`, formData.profileImage);

        try {
            if (currentUser && formData.username !== currentUser.displayName) {
                await updateProfile(currentUser, {
                    displayName: formData.username
                });
                console.log('Firebase display name updated');
            }
        } catch (error) {
            console.error('Error updating display name in Firebase:', error);
        }

        // Update localStorage (backup & consistency)
        localStorage.setItem(`displayName_${userData.username}`, formData.username);
        localStorage.setItem(`userEmail_${userData.username}`, formData.email);

        // update the user data
        const updatedUserData = {
            ...userData,
            username: formData.username,
            email: formData.email
        };

        // update the user data 
        const usersRaw = localStorage.getItem('users');
        let users = {};

        try {
            users = usersRaw ? JSON.parse(usersRaw) : {};
            users[updatedUserData.username] = updatedUserData;
            localStorage.setItem('users', JSON.stringify(users));
        } catch (err) {
            console.error('Failed to update users in localStorage:', err);
        }

        localStorage.setItem('loggedInUser', JSON.stringify(updatedUserData));

        alert('Settings saved successfully!');
        closeModal();
    };

    // function to handle the account click
    const handleAccountClick = () => {
        closeModal();
        navigate('/account');
    };


    // render
    return (
        <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h1>User Settings</h1>
                <form onSubmit={handleSubmit} className='userSettingsContainer'>
                    <div className='profileImageContainer'>
                        <label>Profile Picture</label>
                        <div className="pfp-preview">
                            <img 
                                src={formData.profileImage} 
                                alt="Profile Preview" 
                                className="profile-preview-image"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <label className="change-pfp-button">
                                Change Picture
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>

                    <div className='textInputContainer'>
                        <label htmlFor="username">Display Name</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your display name"
                            autoComplete='off'
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className='textInputContainer'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            autoComplete='off'
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className='buttonContainer'>
                        <button type="submit" className="saveButton" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                        <button 
                            type="button" 
                            className="accountButton"
                            onClick={handleAccountClick}
                            disabled={loading}
                        >
                            Account Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;