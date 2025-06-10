import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './settings.css';

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface SettingsProps {
    closeModal: () => void;
    isLoggedIn: boolean;
    userData: UserData;
}

interface FormData {
    username: string;
    email: string;
    profileImage: string;
}

const Settings = ({ closeModal, isLoggedIn, userData }: SettingsProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        username: userData.username,
        email: userData.email,
        profileImage: localStorage.getItem(`profileImage_${userData.username}`) || '/default-pfp.png'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        localStorage.setItem(`profileImage_${userData.username}`, formData.profileImage);
        localStorage.setItem(`displayName_${userData.username}`, formData.username);
        localStorage.setItem(`userEmail_${userData.username}`, formData.email);
        
        const updatedUserData = {
            ...userData,
            username: formData.username,
            email: formData.email
        };
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((user: any) => user.username === userData.username);
        if (userIndex !== -1) {
            users[userIndex] = updatedUserData;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUserData));
        }
        
        alert('Settings saved successfully!');
        closeModal();
    };

    const handleAccountClick = () => {
        closeModal();
        navigate('/account');
    };

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
                        />
                    </div>

                    <div className='buttonContainer'>
                        <button type="submit" className="saveButton">
                            Save Settings
                        </button>
                        <button 
                            type="button" 
                            className="accountButton"
                            onClick={handleAccountClick}
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